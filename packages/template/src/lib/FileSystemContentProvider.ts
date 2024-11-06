import { ContentProvider } from 'akiradocs-core';
import path from 'path';
import { readFileSync } from 'fs';

export class FileSystemContentProvider implements ContentProvider {
  private contentRoot: string;
  private config: any;

  constructor() {
    this.contentRoot = path.join(process.cwd(), '_contents');
    this.config = this.loadConfig();
  }

  private loadConfig() {
    const configPath = path.join(this.contentRoot, '_config.json');
    return JSON.parse(readFileSync(configPath, 'utf-8'));
  }

  getConfig() {
    return this.config;
  }

  getContentByPath(relativePath: string) {
    const fullPath = path.join(this.contentRoot, this.config.format, `${relativePath}.json`);
    return JSON.parse(readFileSync(fullPath, 'utf-8'));
  }

  getAllContent(directory: string) {
    // Implementation using require.context or fs.readdirSync
  }

  getNavigationContent(type: string) {
    const navPath = path.join(this.contentRoot, this.config.format, type, '_meta.json');
    return JSON.parse(readFileSync(navPath, 'utf-8'));
  }
} 