import React from 'react';

interface CheckListProps {
  items: { text: string; checked: boolean }[];
}

export function CheckList({ items }: CheckListProps) {
  return (
    <ul className="mb-6">
      {items.map((item, index) => (
        <li key={index} className="flex items-center mb-1">
          <input
            type="checkbox"
            checked={item.checked}
            readOnly
            className="mr-2"
          />
          <span className={item.checked ? 'line-through text-gray-500' : ''}>
            {item.text}
          </span>
        </li>
      ))}
    </ul>
  );
}
