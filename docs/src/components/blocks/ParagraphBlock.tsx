import React from 'react';
import { cn } from "@/lib/utils";

interface ParagraphProps {
  id?: string;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function Paragraph({ id, children, align = 'left', styles = {} }: ParagraphProps) {
  // Convert string content to array of lines
  const content = typeof children === 'string' 
    ? children.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {line}
          {i < children.split('\n').length - 1 && <br />}
        </React.Fragment>
      ))
    : children;

  return (
    <p id={id} className={cn(
      'mb-6 text-base leading-relaxed py-1 whitespace-pre-wrap',
      align === 'center' && 'text-center',
      align === 'right' && 'text-right',
      styles.bold && 'font-bold',
      styles.italic && 'italic',
      styles.underline && 'underline'
    )}>
      {content}
    </p>
  );
}
