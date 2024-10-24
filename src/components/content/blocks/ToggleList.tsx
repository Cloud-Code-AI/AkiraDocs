import React, { useState } from 'react';

interface ToggleListProps {
  items: { title: string; content: string }[];
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function ToggleList({ items, align = 'left' }: ToggleListProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div className={`mb-6 ${alignClass}`}>
      {items.map((item, index) => {
        const [isOpen, setIsOpen] = useState(false);
        return (
          <div key={index} className="mb-2">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-full text-left font-bold text-gray-700"
            >
              {item.title}
            </button>
            {isOpen && <div className="pl-4 text-gray-600">{item.content}</div>}
          </div>
        );
      })}
    </div>
  );
}
