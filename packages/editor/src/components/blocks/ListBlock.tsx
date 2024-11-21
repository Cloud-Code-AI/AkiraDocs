import React from 'react';
import { cn } from "@/lib/utils";

interface ListProps {
  id?: string;
  items: string[];
  listType?: 'ordered' | 'unordered';
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function List({ id, items, listType = 'unordered', align = 'left', styles }: ListProps) {
  const Tag = listType === 'ordered' ? 'ol' : 'ul';
  const listStyle = listType === 'ordered' ? 'list-decimal' : 'list-disc';
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';

  return (
    <Tag id={id} className={`mb-6 pl-8 py-1 ${listStyle} ${alignClass}`}>
      {items.map((item, index) => (
        <li key={index} className={cn(
          "mb-1",
          styles?.bold && 'font-bold',
          styles?.italic && 'italic',
          styles?.underline && 'underline'
        )}>{item}</li>
      ))}
    </Tag>
  );
}
