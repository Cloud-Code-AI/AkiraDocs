import { ImageService } from './ImageService';
import LLMService from './LLMService';
import { FileSystemService } from './FileSystemService';
import { MetaBuilder } from '../utils/MetaBuilder';
import axios from 'axios';
import { URL } from 'url';
import { ArticleContent, MetaItem } from '../types';

export class ContentService {
    private visited = new Set<string>();
    private metaStructure: Record<string, MetaItem> = {};
    private baseUrl: string;
    private outputDir: string;
    
    private imageService: ImageService;
    private llmService: LLMService;
    private fileSystem: FileSystemService;
    private metaBuilder: MetaBuilder;

    constructor(private url: string, private urls?: string[], contentType: string = "docs") {
        const urlObject = new URL(urls?.[0] || url);
        this.baseUrl = `${urlObject.protocol}//${urlObject.hostname}`;
        this.outputDir = `_contents/${contentType}`;
        
        this.imageService = new ImageService();
        this.llmService = new LLMService();
        this.fileSystem = new FileSystemService();
        this.metaBuilder = new MetaBuilder();
    }

    private async fetchPage(url: string) {
        try {
            const response = await axios.get(url);
            return response.data;
        } catch (error) {
            console.error(`Failed to fetch ${url}:`, error);
            return null;
        }
    }

    async buildMetaStructure(url: string, outputDir: string = '_contents/articles') {
        if (this.visited.has(url)) return;
        this.visited.add(url);
        
        if (!this.urls) return;
        
        const html = await this.fetchPage(this.urls[0]);
        if (!html) return;

        const processedHtml = await this.imageService.processImages(html);
        const article = await this.llmService.processContent(processedHtml, this.imageService.getImageMap());
        
        await this.fileSystem.saveArticle(article, outputDir);
        
        this.metaBuilder.addToStructure(article, this.outputDir);
    }

    async saveMetaJson() {
        await this.metaBuilder.saveMetaJson(this.outputDir);
    }
}