import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { ArticleContent } from '../types';

export default class LLMService {
    constructor(private templatePath: string = 'src/template.json') {}

    private async getExampleArticle(): Promise<any> {
        try {
            return JSON.parse(
                await fsPromises.readFile(
                    path.join(process.cwd(), this.templatePath),
                    'utf-8'
                )
            );
        } catch (error) {
            console.error('Failed to load template:', error);
            return null;
        }
    }

    private extractJsonContent(text: string): ArticleContent {
        const firstBrace = text.indexOf('{');
        const lastBrace = text.lastIndexOf('}');
        
        if (firstBrace === -1 || lastBrace === -1) {
            throw new Error('No JSON object found in text');
        }
        
        const jsonContent = text.substring(firstBrace, lastBrace + 1);
        return JSON.parse(jsonContent);
    }

    async processContent(content: string, imageUrlMap: Map<string, string>): Promise<ArticleContent> {
        try {
            const exampleArticle = await this.getExampleArticle();
            
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
                    - type: The type of content (heading, paragraph, code, list, image, etc.)
                    - content: The actual content
                    - metadata: Any relevant metadata for the block

                Content to analyze:
                ${content}

                And output the JSON only, no other text.
                Here is an example of the JSON format:
                ${JSON.stringify(exampleArticle, null, 2)}

                For image paths, use this following mapping:
                ${JSON.stringify(Object.fromEntries(imageUrlMap), null, 2)}
            `;

            const { text } = await generateText({
                model: google('gemini-1.5-flash'),
                prompt,
            });

            const article = this.extractJsonContent(text);
            
            // Set default date if not provided
            if (!article.date) {
                article.date = new Date().toISOString().split('T')[0];
            }

            // Process image blocks
            article.blocks = article.blocks.map(block => {
                if (block.type === 'image' && block.content && !block.content.startsWith('/images/')) {
                    return {
                        ...block,
                        content: `/images${block.content}`
                    };
                }
                return block;
            });

            return article;
        } catch (error) {
            console.error('Failed to process content with LLM:', error);
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
}
