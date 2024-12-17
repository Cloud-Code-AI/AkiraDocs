import React, { useState, useRef } from 'react';
import { cn } from '@/lib/utils';
import { Checkbox } from '@/components/ui/checkbox';

interface CheckListProps {
  id?: string;
  content: string;
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  isEditing?: boolean;
  onUpdate?: (content: string) => void;
}

export function CheckList({
  id,
  content,
  align = 'left',
  styles,
  isEditing,
  onUpdate
}: CheckListProps) {
  const [isActive, setIsActive] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Parse content into items array
  const parseContent = (rawContent: string): { text: string; checked: boolean }[] => {
    try {
      return JSON.parse(rawContent);
    } catch {
      return [{ text: rawContent, checked: false }];
    }
  };

  const items = parseContent(content);

  const handleItemChange = (index: number, changes: Partial<{ text: string; checked: boolean }>) => {
    const newItems = [...items];
    newItems[index] = { ...newItems[index], ...changes };
    onUpdate?.(JSON.stringify(newItems));
  };

  const handleAddItem = () => {
    const newItems = [...items, { text: '', checked: false }];
    onUpdate?.(JSON.stringify(newItems));
  };

  const handleRemoveItem = (index: number) => {
    const newItems = items.filter((_, i) => i !== index);
    onUpdate?.(JSON.stringify(newItems));
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>, index: number) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleAddItem();
    } else if (e.key === 'Backspace' && e.currentTarget.value === '') {
      e.preventDefault();
      handleRemoveItem(index);
    }
  };

  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  const textStyles = cn(
    styles?.bold && 'font-bold',
    styles?.italic && 'italic',
    styles?.underline && 'underline'
  );

  if (isEditing && isActive) {
    return (
      <div 
        ref={containerRef}
        className={cn("space-y-2 py-1 mb-6", alignClass)}
        onBlur={(e) => {
          if (!containerRef.current?.contains(e.relatedTarget as Node)) {
            setIsActive(false);
          }
        }}
      >
        {items.map((item, index) => (
          <div key={index} className="flex items-center gap-2">
            <Checkbox
              checked={item.checked}
              onCheckedChange={(checked) => handleItemChange(index, { checked: checked as boolean })}
            />
            <input
              type="text"
              value={item.text}
              onChange={(e) => handleItemChange(index, { text: e.target.value })}
              onKeyDown={(e) => handleKeyDown(e, index)}
              className={cn(
                "flex-1 bg-transparent border-none focus:outline-none",
                textStyles,
                item.checked && "line-through text-muted-foreground"
              )}
              placeholder="Add a task..."
              autoFocus={index === items.length - 1}
            />
          </div>
        ))}
      </div>
    );
  }

  return (
    <div
      ref={containerRef}
      onClick={() => isEditing && setIsActive(true)}
      className={cn("cursor-text focus:outline-none", alignClass)}
      tabIndex={0}
    >
      <ul className={cn("space-y-2 py-1 mb-6", textStyles)}>
        {items.map((item, index) => (
          <li key={index} className="flex items-center gap-2">
            <Checkbox
              checked={item.checked}
              onCheckedChange={isEditing ? (checked) => handleItemChange(index, { checked: checked as boolean }) : undefined}
              disabled={!isEditing}
            />
            <span className={cn(item.checked && "line-through text-muted-foreground")}>
              {item.text}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
