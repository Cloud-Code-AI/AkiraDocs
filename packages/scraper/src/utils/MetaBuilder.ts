import { promises as fsPromises } from 'fs';
import path from 'path';
import { ArticleContent, MetaItem } from '../types';
import { FileSystemService } from '../services/FileSystemService';

export class MetaBuilder {
    private metaStructure: Record<string, MetaItem> = {};
    private fileSystem: FileSystemService;

    constructor() {
        this.fileSystem = new FileSystemService();
    }

    addToStructure(article: ArticleContent, outputDir: string) {
        const key = article.keyname || article.filename || 'default';
        this.metaStructure[key] = {
            title: article.title,
            path: outputDir.replace("_contents/", "") + "/" + (article.filename || key),
        };
    }

    async saveMetaJson(outputDir: string) {
        const existingMeta = await this.fileSystem.readExistingMeta(outputDir);
        const updatedMeta = { ...existingMeta, ...this.metaStructure };
        
        await fsPromises.writeFile(
            path.join(outputDir, '_meta.json'),
            JSON.stringify(updatedMeta, null, 2)
        );
    }
}