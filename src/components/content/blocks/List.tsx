import React from 'react';
import { cn } from "@/lib/utils";

interface ListProps {
  items: string[];
  ordered?: boolean;
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function List({ items, ordered = false, align = 'left', styles }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul';
  const listStyle = ordered ? 'list-decimal' : 'list-disc';
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';

  return (
    <Tag className={`mb-6 pl-8 py-1 ${listStyle} ${alignClass}`}>
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
