import React from 'react';

interface FileProps {
  url: string;
  name: string;
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function File({ url, name, align = 'left' }: FileProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div className={`mb-6 ${alignClass}`}>
      <a href={url} download className="text-blue-500 hover:underline">
        {name}
      </a>
    </div>
  );
}
