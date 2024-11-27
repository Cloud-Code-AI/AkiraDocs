import React, { useEffect, useRef, useState } from 'react';
import { cn } from "@/lib/utils";

interface ListProps {
  id?: string;
  content: string;
  listType?: 'ordered' | 'unordered';
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  isEditing?: boolean;
  onUpdate?: (content: string) => void;
}

export function List({
  id,
  content,
  listType = 'unordered',
  align = 'left',
  styles,
  isEditing,
  onUpdate
}: ListProps) {
  const [isActive, setIsActive] = useState(false);
  const textareaRef = useRef<HTMLTextAreaElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);

  // Handle click to edit
  const handleClick = () => {
    if (isEditing) {
      setIsActive(true);
    }
  };

  const handleBlur = (e: React.FocusEvent) => {
    // Only blur if clicking outside the component
    if (!containerRef.current?.contains(e.relatedTarget as Node)) {
      setIsActive(false);
    }
  };

  // Parse content if it's accidentally stringified
  const parseContent = (rawContent: string): string => {
    try {
      // If content is a stringified array, parse it and join with newlines
      if (rawContent.startsWith('[')) {
        return JSON.parse(rawContent).join('\n');
      }
      return rawContent;
    } catch {
      return rawContent;
    }
  };

  const normalizedContent = parseContent(content);

  // Auto-adjust height function
  const adjustTextareaHeight = () => {
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = '0';  // Reset height
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  // Determine if we should show the editing view
  const showEditingView = isEditing && isActive;

  // Adjust height on content change
  useEffect(() => {
    adjustTextareaHeight();
  }, [normalizedContent]);

  // Adjust height when switching to edit mode
  useEffect(() => {
    if (showEditingView) {
      adjustTextareaHeight();
    }
  }, [showEditingView]);

  // Format content for editing view
  const getEditableContent = (rawContent: string): string => {
    const items = rawContent.split('\n');
    return items
      .map((item, index) => 
        listType === 'ordered' 
          ? `${index + 1}. ${item}` 
          : `• ${item}`
      )
      .join('\n');
  };

  // Parse content back to normal format when saving
  const parseEditableContent = (editableContent: string): string => {
    return editableContent
      .split('\n')
      .map(line => line.replace(/^[\d]+\.\s+/, '').replace(/^[•]\s+/, ''))
      .join('\n');
  };

  // Handle key presses for new lines and backspace
  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    const textarea = e.currentTarget;
    const { selectionStart, selectionEnd } = textarea;
    const currentContent = textarea.value;
    const lines = currentContent.split('\n');
    
    // Find which line we're on
    let currentLineIndex = 0;
    let charCount = 0;
    for (let i = 0; i < lines.length; i++) {
      charCount += lines[i].length + 1; // +1 for newline
      if (charCount > selectionStart) {
        currentLineIndex = i;
        break;
      }
    }

    if (e.key === 'Enter') {
      e.preventDefault();
      // Insert new line with proper prefix
      const prefix = listType === 'ordered' ? `${currentLineIndex + 2}. ` : '• ';
      const newContent = [
        ...lines.slice(0, currentLineIndex + 1),
        prefix,
        ...lines.slice(currentLineIndex + 1)
      ].join('\n');

      onUpdate?.(parseEditableContent(newContent));
    } else if (e.key === 'Backspace') {
      const currentLine = lines[currentLineIndex];
      const prefix = listType === 'ordered' ? `${currentLineIndex + 1}. ` : '• ';
      
      // If we're at the start of a line's content (right after the prefix)
      if (currentLine === prefix || currentLine === prefix.trim()) {
        e.preventDefault();
        
        // Remove the current line and update content
        const newContent = [
          ...lines.slice(0, currentLineIndex),
          ...lines.slice(currentLineIndex + 1)
        ]
          .map((line, index) => {
            // Reformat ordered list numbers if needed
            if (listType === 'ordered') {
              return line.replace(/^\d+\./, `${index + 1}.`);
            }
            return line;
          })
          .join('\n');

        onUpdate?.(parseEditableContent(newContent));
      }
    }
  };

  // Modified content change handler
  const handleContentChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const rawContent = parseEditableContent(e.target.value);
    onUpdate?.(rawContent);
  };

  // Determine alignment classes
  const alignmentClasses = {
    left: 'text-left',
    center: 'text-center mx-auto',
    right: 'text-right ml-auto'
  }[align];

  // Style classes based on props
  const textStyles = cn(
    styles?.bold && 'font-bold',
    styles?.italic && 'italic',
    styles?.underline && 'underline'
  );

  if (showEditingView) {
    return (
      <div 
        ref={containerRef}
        className="relative w-full"
        onBlur={handleBlur}
      >
        <textarea
          ref={textareaRef}
          value={getEditableContent(normalizedContent)}
          onChange={handleContentChange}
          onKeyDown={handleKeyDown}
          className={cn(
            "w-full p-2 bg-transparent",
            "resize-none focus:outline-none",
            "border rounded-md",
            textStyles,
            "min-h-[1.5em] overflow-hidden",
          )}
          placeholder={`Enter ${listType === 'ordered' ? 'numbered' : 'bulleted'} list items...`}
          autoFocus
          rows={1}
        />
      </div>
    );
  }

  // Split content into items and filter out empty lines
  const items = normalizedContent
    .split('\n')
    .filter(item => item.trim() !== '');

  const ListComponent = listType === 'ordered' ? 'ol' : 'ul';
  const listStyleClass = listType === 'ordered' ? 'list-decimal' : 'list-disc';

  return (
    <div
      ref={containerRef}
      onClick={handleClick}
      onBlur={handleBlur}
      className="focus:outline-none cursor-text"
      tabIndex={0}
    >
      <ListComponent
        id={id}
        className={cn(
          "pl-8 py-1",
          listStyleClass,
          alignmentClasses,
          textStyles
        )}
      >
        {items.map((item, index) => (
          <li key={index} className="mb-1">
            {item}
          </li>
        ))}
      </ListComponent>
    </div>
  );
}
