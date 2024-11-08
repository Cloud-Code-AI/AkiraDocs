import React from 'react';
import { cn } from "@/components/utils";

interface BlockquoteProps {
  id?: string;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function Blockquote({ id, children, align = 'left', styles }: BlockquoteProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <blockquote id={id} className={cn(
      `border-l-4 border-border pl-4 text-muted-foreground mb-6 py-1 ${alignClass}`,
      styles?.bold && 'font-bold',
      styles?.italic && 'italic',
      styles?.underline && 'underline'
    )}>
      {children}
    </blockquote>
  );
}
