import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';
import { cn } from "@/lib/utils";

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
  const [openStates, setOpenStates] = useState<boolean[]>(new Array(items.length).fill(false));
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  
  return (
    <div id={id} className={`mb-6 py-1 ${alignClass}`}>
      {items.map((item, index) => (
        <div key={index} className="mb-2">
          <button
            onClick={() => {
              const newOpenStates = [...openStates];
              newOpenStates[index] = !newOpenStates[index];
              setOpenStates(newOpenStates);
            }}
            className={cn(
              "w-full text-left font-bold text-foreground flex items-center",
              styles?.italic && 'italic',
              styles?.underline && 'underline'
            )}
          >
            <span className="flex-shrink-0 w-5 h-5 mr-2">
              {openStates[index] ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
            </span>
            <span>{item.title}</span>
          </button>
          {openStates[index] && (
            <div className={cn(
              "mt-2 ml-7 text-muted-foreground",
              styles?.bold && 'font-bold',
              styles?.italic && 'italic',
              styles?.underline && 'underline'
            )}>{item.content}</div>
          )}
        </div>
      ))}
    </div>
  );
}
