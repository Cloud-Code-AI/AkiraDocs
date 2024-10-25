import React from 'react';
import { cn } from "@/lib/utils";

interface BlockquoteProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function Blockquote({ children, align = 'left', styles }: BlockquoteProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <blockquote className={cn(
      `border-l-4 border-gray-300 pl-4 text-gray-600 mb-6 py-1 ${alignClass}`,
      styles?.bold && 'font-bold',
      styles?.italic && 'italic',
      styles?.underline && 'underline'
    )}>
      {children}
    </blockquote>
  );
}
