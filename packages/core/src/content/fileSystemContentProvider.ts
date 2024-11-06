import { ContentProvider } from '@/types/ContentProvider';
import { promises as fs } from 'fs';
import path from 'path';

type Metadata = {
    title?: string,
    description?: string
};

export class FileSystemContentProvider implements ContentProvider {
  private contentRoot: string;
  private metadataCache: Metadata | null = null;

  constructor(contentRoot: string) {
    this.contentRoot = contentRoot;
  }

  async getMetadata(): Promise<Metadata> {
    // Cache the metadata to avoid repeated disk reads
    if (this.metadataCache) {
      return this.metadataCache;
    }

    try {
      const configPath = path.join(this.contentRoot, '_config.json');
      const configContent = await fs.readFile(configPath, 'utf-8');
      const config = JSON.parse(configContent);

      this.metadataCache = {
        title: config.title ?? "Akira Docs",
        description: config.description ?? "Next-Gen Documentation"
      };

      return this.metadataCache;
    } catch (error) {
      console.error('Error loading metadata:', error);
      return {
        title: "Akira Docs",
        description: "Next-Gen Documentation"
      };
    }
  }
  async getContent(contentPath: string): Promise<string> {
    const fullPath = path.join(this.contentRoot, contentPath);
    try {
      return await fs.readFile(fullPath, 'utf-8');
    } catch (error) {
      throw new Error(`Could not load content at path: ${contentPath}`);
    }
  }

  async listContents(type: 'docs' | 'articles'): Promise<string[]> {
    const typeDir = path.join(this.contentRoot, type);
    try {
      const files = await fs.readdir(typeDir, { recursive: true });
      return files.filter(file => 
        file.endsWith('.md') || file.endsWith('.mdx')
      );
    } catch (error) {
      console.error(`Error listing ${type}:`, error);
      return [];
    }
  }
}

// Factory function to create the appropriate provider
export function createContentProvider(type: 'filesystem', options: { contentRoot: string }): ContentProvider {
  switch (type) {
    case 'filesystem':
      return new FileSystemContentProvider(options.contentRoot);
    default:
      throw new Error(`Unknown content provider type: ${type}`);
  }
}