import React from 'react';

interface ListProps {
  items: string[];
  ordered?: boolean;
}

export function List({ items, ordered = false }: ListProps) {
  const Tag = ordered ? 'ol' : 'ul';
  const listStyle = ordered ? 'list-decimal' : 'list-disc';

  return (
    <Tag className={`mb-6 pl-8 ${listStyle}`}>
      {items.map((item, index) => (
        <li key={index} className="mb-1">{item}</li>
      ))}
    </Tag>
  );
}
