import axios from 'axios';
import * as cheerio from 'cheerio';
import fs from 'fs';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { URL } from 'url';
import yargs from 'yargs';
import { hideBin } from 'yargs/helpers';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';

interface MetaItem {
    title: string;
    path: string;
    items?: Record<string, MetaItem>;
}

interface Block {
  id: string;
  type: string;
  content: string;
  metadata?: Record<string, any>;
  imageUrl?: string;
}

interface ArticleContent {
  title: string;
  description: string;
  author: string;
  date: string;
  blocks: Block[];
  filename?: string;
  keyname?: string;
}

class DocScraper {
    private visited = new Set<string>();
    private metaStructure: Record<string, MetaItem> = {};
    private urlList?: string[];
    private outputDir?: string;
    private imageCache = new Set<string>();

    constructor(private baseUrl: string, urls?: string[], outputDir: string = "_contents/articles") {
        // if (!this.baseUrl) {
        //     throw new Error("Base URL must be provided and cannot be empty.");
        // }
        console.log("urls", urls);
        // this.urlList = urls?.map(url => new URL(url, this.baseUrl).toString());
        this.urlList = urls;
        this.outputDir = outputDir;
    }

    private async fetchPage(url: string) {
        try {
            console.log("fetching", url);
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            return null;
        }
    }

    private async findDocLinks(html: string): Promise<string[]> {
        const $ = cheerio.load(html);
        const links: string[] = [];

        $('a[href*="/docs/"]').each((_, element) => {
            const href = $(element).attr('href');
            if (href) {
                const fullUrl = new URL(href, this.baseUrl).toString();
                links.push(fullUrl);
            }
        });

        return links;
    }

    private extractJsonContent(text: string): any {
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error('No JSON object found in text');
        }
        
        const jsonContent = text.substring(firstBrace, lastBrace + 1);
        const parsed = JSON.parse(jsonContent);
        const outputDir = path.join(process.cwd(), this.outputDir || '_contents/articles');
        if (!fs.existsSync(outputDir)) {
            fs.mkdirSync(outputDir);
        }
        const filename = parsed.filename || 'default.json';
        const filePath = path.join(outputDir, filename);
        // fs.writeFileSync(filePath, JSON.stringify(parsed, null, 2));
        console.log(`File saved to ${filePath}`);
        return parsed;
    }

    private async downloadImage(imageUrl: string): Promise<string | null> {
        try {
            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const urlPath = new URL(imageUrl).pathname;
            const filename = path.basename(urlPath);
            const publicDir = path.join(process.cwd(), 'public/images');
            
            // Create directory if it doesn't exist
            await fsPromises.mkdir(publicDir, { recursive: true });
            
            const localPath = path.join(publicDir, filename);
            await fsPromises.writeFile(localPath, response.data);
            
            // Return the new public path
            return `/images/${filename}`;
        } catch (error) {
            console.error(`Failed to download image ${imageUrl}:`, error);
            return null;
        }
    }

    private async processContentWithLLM(html: string): Promise<ArticleContent> {
        const $ = cheerio.load(html);
        
        // Extract and download images before processing content
        const imagePromises: Promise<void>[] = [];
        $('img').each((_, element) => {
            const imgSrc = $(element).attr('src');
            if (imgSrc && !this.imageCache.has(imgSrc)) {
                this.imageCache.add(imgSrc);
                imagePromises.push(
                    this.downloadImage(new URL(imgSrc, this.baseUrl).toString())
                        .then(newPath => {
                            if (newPath) {
                                $(element).attr('src', newPath);
                            }
                        })
                );
            }
        });

        // Wait for all images to be downloaded
        await Promise.all(imagePromises);
        
        const rawContent = $('body').text().trim();
        
        const exampleArticle = JSON.parse(
            await fsPromises.readFile(
                path.join(process.cwd(), 'src/template.json'), 
                'utf-8'
            )
        );
        
        const prompt = `
          Analyze this documentation page and extract the following information in JSON format:
          - title: The main title of the page
          - description: A brief summary of the content
          - author: Try to find the author, default to "Unknown" if not found
          - date: Try to find the publication date, default to current date if not found
          - filename: The filename of the article, default to the url path if not found
          - keyname: The keyname of the article, default to the url path if not found
          - blocks: Break down the content into structured blocks, where each block has:
            - id: A unique identifier
            - type: The type of content (heading, paragraph, code, list, etc.)
            - content: The actual content
            - metadata: Any relevant metadata for the block

          Content to analyze:
          ${rawContent}

          And output the JSON only, no other text.
          Here is an example of the JSON format:
          ${JSON.stringify(exampleArticle, null, 2)}
        `;

        const { text } = await generateText({
            model: google('gemini-1.5-flash'),
            prompt,
        });

        console.log("text", text);

        try {
            const article: ArticleContent = this.extractJsonContent(text);
            if (!article.date) {
                article.date = new Date().toISOString().split('T')[0];
            }
            return article;
        } catch (error) {
            console.error('Failed to parse LLM response:', error);
            // Return a basic structure if parsing fails
            return {
                title: 'Failed to Parse',
                description: 'Content parsing failed',
                author: 'Unknown',
                date: new Date().toISOString().split('T')[0],
                blocks: [{
                    id: 'error',
                    type: 'error',
                    content: 'Failed to parse content'
                }]
            };
        }
    }

    private async getDocLinks(html: string): Promise<string[]> {
        if (this.urlList) {
            return this.urlList;
        }
        return this.findDocLinks(html);
    }

    async buildMetaStructure(url: string, outputDir: string = '_contents/articles') {
        if (this.visited.has(url)) return;
        this.visited.add(url);
        if (!this.urlList) {
            return;
        }
        const html = await this.fetchPage(this.urlList[0]);
        if (!html) return;

        const article = await this.processContentWithLLM(html);
        const filename = article["filename"] || `${url.replace(/\//g, '-')}.json`;
        const outputPath = path.join(outputDir, `${filename}.json`);
        
        await fsPromises.mkdir(path.dirname(outputPath), { recursive: true });
        await fsPromises.writeFile(outputPath, JSON.stringify(article, null, 2));

        this.metaStructure[article.keyname || url] = {
            title: article.title,
            path: this.outputDir + "/" + (article.filename || url),
        };
        // const links = await this.getDocLinks(html);
        // for (const link of links) {
        //     await this.buildMetaStructure(link);
        // }
    }

    async saveMetaJson() {
        if (!this.outputDir) {
            return;
        }
        await fsPromises.mkdir(this.outputDir, { recursive: true });
        const outputPath = path.join(this.outputDir, '_meta.json');
        
        // Read existing meta.json if it exists
        let existingMeta = {};
        try {
            const existingContent = await fsPromises.readFile(outputPath, 'utf-8');
            existingMeta = JSON.parse(existingContent);
        } catch (error) {
            // File doesn't exist or is invalid, start with empty object
            console.log("No existing meta.json found, starting with empty object");
        }

        // Merge existing meta with new meta structure
        const updatedMeta = {
            ...existingMeta,
            ...this.metaStructure
        };

        // Write updated meta.json
        await fsPromises.writeFile(
            outputPath,
            JSON.stringify(updatedMeta, null, 2)
        );
    }
}

async function main() {
    const argv = await yargs(hideBin(process.argv))
        .option('url', {
            alias: 'u',
            type: 'string',
            description: 'Documentation site URL to scrape',
            default: ''
        })
        .option('urls', {
            alias: 'l',
            type: 'array',
            description: 'List of specific URLs to scrape',
            default: undefined
        })
        .option('output', {
            alias: 'o',
            type: 'string',
            description: 'Output directory for _meta.json',
            default: '_contents/docs'
        })
        .help()
        .parseAsync();

    const scraper = new DocScraper(argv.url, argv.urls as string[] | undefined, argv.output);
    console.log(`Starting scrape of: ${argv.url}`);
    await scraper.buildMetaStructure(`${argv.url}`, argv.output);
    await scraper.saveMetaJson();
    console.log(`Scraping complete. Meta file saved to: ${argv.output}/_meta.json`);
}

main().catch(console.error);