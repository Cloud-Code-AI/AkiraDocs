import React from 'react';

interface BlockquoteProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function Blockquote({ children, align = 'left' }: BlockquoteProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <blockquote className={`border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-6 ${alignClass}`}>
      {children}
    </blockquote>
  );
}
