import React from 'react';

interface BlockquoteProps {
  children: React.ReactNode;
}

export function Blockquote({ children }: BlockquoteProps) {
  return (
    <blockquote className="border-l-4 border-gray-300 pl-4 italic text-gray-600 mb-6">
      {children}
    </blockquote>
  );
}
