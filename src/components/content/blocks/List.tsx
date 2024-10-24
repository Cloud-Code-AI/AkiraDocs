import React from 'react';

interface ListProps {
  items: string[];
  ordered?: boolean;
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function List({ items, ordered = false, align = 'left' }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul';
  const listStyle = ordered ? 'list-decimal' : 'list-disc';
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';

  return (
    <Tag className={`mb-6 pl-8 py-1 ${listStyle} ${alignClass}`}>
      {items.map((item, index) => (
        <li key={index} className="mb-1">{item}</li>
      ))}
    </Tag>
  );
}
