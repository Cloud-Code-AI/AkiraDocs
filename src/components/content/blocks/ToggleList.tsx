import React, { useState } from 'react';
import { ChevronRight, ChevronDown } from 'lucide-react';

interface ToggleListProps {
  items: { title: string; content: string }[];
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function ToggleList({ items, align = 'left' }: ToggleListProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div className={`mb-6 py-1 ${alignClass}`}>
      {items.map((item, index) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <div key={index} className="mb-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left font-bold text-gray-700 flex items-center"
            >
              <span className="flex-shrink-0 w-5 h-5 mr-2">
                {isOpen ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
              </span>
              <span>{item.title}</span>
            </button>
            {isOpen && (
              <div className="mt-2 ml-7 text-gray-600">{item.content}</div>
            )}
          </div>
        );
      })}
    </div>
  );
}
