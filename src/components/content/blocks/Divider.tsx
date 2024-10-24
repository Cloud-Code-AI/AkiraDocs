import React from 'react';

export function Divider({ align = 'left' }: { align?: 'left' | 'center' | 'right' }) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return <hr className={`border-t border-gray-300 my-8 py-1 ${alignClass}`} />;
}
