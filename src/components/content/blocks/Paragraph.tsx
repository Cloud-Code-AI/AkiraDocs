import React from 'react';

interface ParagraphProps {
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function Paragraph({ children, align = 'left' }: ParagraphProps) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : '';
  return <p className={`mb-6 text-base leading-relaxed py-1 ${alignClass}`}>{children}</p>;
}
