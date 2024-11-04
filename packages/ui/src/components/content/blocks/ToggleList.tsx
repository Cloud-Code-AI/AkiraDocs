import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from "@/components/utils";

interface ToggleListProps {
  id?: string;
  items: { title: string; content: string }[];
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function ToggleList({ id, items, align = 'left', styles }: ToggleListProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div id={id} className={`mb-6 py-1 ${alignClass}`}>
      {items.map((item, index) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <div key={index} className="mb-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className={cn(
                "w-full text-left font-bold text-foreground flex items-center",
                styles?.italic && 'italic',
                styles?.underline && 'underline'
              )}
            >
              <span className="flex-shrink-0 w-5 h-5 mr-2">
                {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </span>
              <span>{item.title}</span>
            </button>
            {isOpen && (
              <div className={cn(
                "mt-2 ml-7 text-muted-foreground",
                styles?.bold && 'font-bold',
                styles?.italic && 'italic',
                styles?.underline && 'underline'
              )}>{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
