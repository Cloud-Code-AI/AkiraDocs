export interface MetaItem {
    title: string;
    path: string;
    items?: Record<string, MetaItem>;
}

export interface Block {
    id: string;
    type: string;
    content: string;
    metadata?: Record<string, any>;
    imageUrl?: string;
}

export interface ArticleContent {
    title: string;
    description: string;
    author: string;
    date: string;
    blocks: Block[];
    filename?: string;
    keyname?: string;
}