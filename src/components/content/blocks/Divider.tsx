import React from 'react';

interface DividerProps {
  id?: string;
  align?: 'left' | 'center' | 'right';
}

export function Divider({ id, align = 'left' }: DividerProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return <hr id={id} className={`border-t border-border my-8 py-1 ${alignClass}`} />;
}
