import React from 'react';

interface EmojiProps {
  symbol: string;
  label?: string;
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function Emoji({ symbol, label, align = 'left' }: EmojiProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <span role="img" aria-label={label || ''} aria-hidden={!label} className={`py-1 ${alignClass}`}>
      {symbol}
    </span>
  );
}
