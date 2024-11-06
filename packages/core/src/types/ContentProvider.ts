export interface Metadata {
    title?: string;
    description?: string;
  }
  
  export interface ContentProvider {
    getMetadata(): Promise<Metadata>;
    getContent(path: string): Promise<string>;
    listContents(type: 'docs' | 'articles'): Promise<string[]>;
  }