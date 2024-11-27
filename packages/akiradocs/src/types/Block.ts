export type BlockType = 
  | 'paragraph' 
  | 'heading' 
  | 'code' 
  | 'image' 
  | 'list' 
  | 'blockquote' 
  | 'divider' 
  // | 'table'
  // | 'toggleList' 
  // | 'checkList' 
  // | 'video' 
  // | 'audio' 
  // | 'file' 
  // | 'emoji'
  | 'callout'
  | 'apiReference';

export interface Block {
  id: string;
  type: BlockType;
  content: string;
  metadata?: {
      level?: number; // For headings
      styles?: {
        bold?: boolean;
        italic?: boolean;
        underline?: boolean;
      };
      language?: string; // For code blocks
      alt?: string; // For images
      caption?: string; // For images, videos, and audio
      listType?: 'ordered' | 'unordered'; // For lists
      size?: 'small' | 'medium' | 'large' | 'full'; // for images
      position?: 'left' | 'center' | 'right'; // for images
      headers?: string[]; // For tables
      rows?: string[][]; // For tables
      items?: { title: string; content: string }[]; // For toggle lists
      checkedItems?: { text: string; checked: boolean }[]; // For check lists
      name?: string; // For files
      label?: string; // For emojis
      filename?: string; // For code blocks
      showLineNumbers?: boolean; // For code blocks
      align?: 'left' | 'center' | 'right'; // For alignment
    type?: 'info' | 'warning' | 'success' | 'error'; // For callouts
    title?: string; // For callouts
  };
}

export interface Post {
  id: string;
  slug?: string;
  title: string;
  description: string;
  author: string;
  filename: string;
  publishDate: string;
  modifiedDate: string;
  category: string;
  keywords: string[];
  blocks: Block[];
  imageUrl?: string;
}

export interface APIReferenceBlock extends Block {
  type: 'apiReference';
  metadata: Block['metadata'] & {
    endpoint: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH';
    parameters?: {
      name: string;
      type: string;
      required: boolean;
      description: string;
    }[];
    responses?: {
      code: number;
      description: string;
      example?: any;
    }[];
  };
}
