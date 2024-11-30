import React, { useRef } from 'react';
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
  isEditing?: boolean;
  onUpdate?: (content: string) => void;
}

export function Paragraph({ 
  id, 
  children, 
  align = 'left', 
  styles = {}, 
  isEditing,
  onUpdate 
}: ParagraphProps) {
  const inputRef = useRef<HTMLDivElement>(null);

  if (isEditing) {
    return (
      <div
        ref={inputRef}
        contentEditable
        suppressContentEditableWarning
        onBlur={(e) => {
          const target = e.target as HTMLElement;
          if (!target) return;
          
          // Preserve newlines by getting the raw HTML and converting it properly
          let content = target.innerHTML;
          
          // Normalize line breaks
          content = content.replace(/<div><br><\/div>/g, '\n')
          content = content.replace(/<div>/g, '\n')
          content = content.replace(/<\/div>/g, '')
          content = content.replace(/<br>/g, '\n')
          content = content.replace(/<br\/>/g, '\n')
          content = content.replace(/&nbsp;/g, ' ')
          
          // Clean up double newlines
          content = content.replace(/\n\n+/g, '\n\n')
          content = content.trim()
          
          onUpdate?.(content);
        }}
        dangerouslySetInnerHTML={{ __html: String(children).replace(/\n/g, '<br>') }}
        className={cn(
          'mb-6 text-base leading-relaxed py-1 whitespace-pre-wrap focus:outline-none rounded-md',
          align === 'center' && 'text-center',
          align === 'right' && 'text-right',
          styles.bold && 'font-bold',
          styles.italic && 'italic',
          styles.underline && 'underline'
        )}
      />
    );
  }

  const processContent = (text: string) => {
    return text.split(/(<strong>.*?<\/strong>)/).map((part, index) => {
      if (part.startsWith('<strong>') && part.endsWith('</strong>')) {
        const innerText = part.replace(/<\/?strong>/g, '');
        return <strong key={index}>{innerText}</strong>;
      }
      return part;
    });
  };

  const content = typeof children === 'string' 
    ? children.split('\n').map((line, i) => (
        <React.Fragment key={i}>
          {processContent(line)}
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
