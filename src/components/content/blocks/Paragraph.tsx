import React from 'react';
import { cn } from "@/lib/utils";

interface ParagraphProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function Paragraph({ children, align = 'left', styles }: ParagraphProps) {
  return (
    <p className={cn(
      'mb-6 text-base leading-relaxed py-1',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      styles?.bold && 'font-bold',
      styles?.italic && 'italic',
      styles?.underline && 'underline'
    )}>
      {children}
    </p>
  );
}
