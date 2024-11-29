import React, { useEffect, useRef } from 'react';
import { cn } from "@/lib/utils";

interface BlockquoteProps {
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

export function Blockquote({ id, children, align = 'left', styles, isEditing, onUpdate }: BlockquoteProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';

  const adjustHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '0px';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  useEffect(() => {
    if (isEditing) {
      adjustHeight();
    }
  }, [isEditing, children]);

  const commonStyles = cn(
    styles?.bold && 'font-bold',
    styles?.italic && 'italic',
    styles?.underline && 'underline'
  );

  if (isEditing) {
    return (
      <div className={cn("border-l-4 border-border pl-4 text-muted-foreground", alignClass)}>
        <textarea
          ref={textareaRef}
          value={children as string}
          onChange={(e) => {
            onUpdate?.(e.target.value);
            adjustHeight();
          }}
          className={cn(
            "w-full bg-transparent resize-none focus:outline-none",
            "block p-0 m-0",
            "leading-[inherit]",
            commonStyles
          )}
        />
      </div>
    );
  }

  return (
    <blockquote 
      id={id} 
      className={cn(
        "border-l-4 border-border pl-4 text-muted-foreground",
        alignClass,
        commonStyles
      )}
    >
      {children}
    </blockquote>
  );
}
