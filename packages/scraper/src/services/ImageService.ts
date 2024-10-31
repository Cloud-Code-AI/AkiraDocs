import axios from 'axios';
import { promises as fsPromises } from 'fs';
import path from 'path';
import { URL } from 'url';

export class ImageService {
    private imageCache = new Set<string>();
    private imageUrlMap = new Map<string, string>();

    async downloadImage(imageUrl: string, outputDir: string = 'public'): Promise<string | null> {
        try {
            // Skip if already downloaded
            if (this.imageCache.has(imageUrl)) {
                return this.imageUrlMap.get(imageUrl) || null;
            }

            const response = await axios.get(imageUrl, { responseType: 'arraybuffer' });
            const urlPath = new URL(imageUrl).pathname;
            
            // Remove leading slash and create directory structure
            const relativePath = urlPath.replace(/^\//, '');
            const publicDir = path.join(process.cwd(), outputDir, 'images');
            
            // Create full directory path including subdirectories
            const fullPath = path.join(publicDir, path.dirname(relativePath));
            await fsPromises.mkdir(fullPath, { recursive: true });
            
            // Save file with original path structure
            const localPath = path.join(publicDir, relativePath);
            await fsPromises.writeFile(localPath, response.data);
            
            // Cache the downloaded image
            const publicPath = `/images/${relativePath}`;
            this.imageCache.add(imageUrl);
            this.imageUrlMap.set(imageUrl, publicPath);
            
            return publicPath;
        } catch (error) {
            console.error(`Failed to download image ${imageUrl}:`, error);
            return null;
        }
    }

    getImageMap(): Map<string, string> {
        return this.imageUrlMap;
    }

    clearCache(): void {
        this.imageCache.clear();
        this.imageUrlMap.clear();
    }
}