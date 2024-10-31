import { promises as fsPromises } from 'fs';
import path from 'path';
import { ArticleContent } from '../types';

export class FileSystemService {
    async saveArticle(article: ArticleContent, outputDir: string) {
        const filename = article.filename || 'default.json';
        const fullPath = path.join(process.cwd(), outputDir);
        
        await fsPromises.mkdir(fullPath, { recursive: true });
        await fsPromises.writeFile(
            path.join(fullPath, `${filename}.json`),
            JSON.stringify(article, null, 2)
        );
    }

    async readExistingMeta(outputDir: string): Promise<Record<string, any>> {
        try {
            const metaPath = path.join(outputDir, '_meta.json');
            const content = await fsPromises.readFile(metaPath, 'utf-8');
            return JSON.parse(content);
        } catch {
            return {};
        }
    }
}
