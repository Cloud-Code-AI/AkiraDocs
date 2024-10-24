export type BlockType = 
  | 'paragraph' 
  | 'heading' 
  | 'code' 
  | 'image' 
  | 'list' 
  | 'divider' 
  | 'table'
  | 'blockquote' 
  | 'toggleList' 
  | 'checkList' 
  | 'video' 
  | 'audio' 
  | 'file' 
  | 'emoji';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
    level?: number; // For headings
    language?: string; // For code blocks
    alt?: string; // For images
    caption?: string; // For images, videos, and audio
    listType?: 'ordered' | 'unordered'; // For lists
    size?: 'small'; // For images
    position?: 'left'; // For images
    headers?: string[]; // For tables
    rows?: string[][]; // For tables
    items?: { title: string; content: string }[]; // For toggle lists
    checkedItems?: { text: string; checked: boolean }[]; // For check lists
    name?: string; // For files
    label?: string; // For emojis
    filename?: string; // For code blocks
    showLineNumbers?: boolean; // For code blocks
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
