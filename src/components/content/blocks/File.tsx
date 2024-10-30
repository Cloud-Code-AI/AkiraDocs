import React from 'react';
import { cn } from "@/lib/utils";

interface FileProps {
  id?: string;
  url: string;
  name: string;
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function File({ id, url, name, align = 'left', styles }: FileProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div id={id} className={`mb-6 py-1 ${alignClass}`}>
      <a href={url} download className={cn(
        "text-primary hover:text-primary/80 hover:underline",
        styles?.bold && 'font-bold',
        styles?.italic && 'italic',
        styles?.underline && 'underline'
      )}>
        {name}
      </a>
    </div>
  );
}
