export type BlockType = 'paragraph' | 'heading' | 'code' | 'image' | 'list';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    level?: number;
    language?: string;
    alt?: string;
    caption?: string;
    listType?: 'ordered' | 'unordered';
  };
}

export interface BlogPost {
  id: string;
  title: string;
  description: string;
  author: string;
  date: string;
  blocks: Block[];
}