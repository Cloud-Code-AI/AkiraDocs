import React, { useState } from 'react';

interface ToggleListProps {
  items: { title: string; content: string }[];
}

export function ToggleList({ items }: ToggleListProps) {
  return (
    <div className="mb-6">
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
