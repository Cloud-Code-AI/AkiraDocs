import React from 'react';

interface ParagraphProps {
  children: React.ReactNode;
}

export function Paragraph({ children }: ParagraphProps) {
  return <p className="mb-6 text-base leading-relaxed">{children}</p>;
}
