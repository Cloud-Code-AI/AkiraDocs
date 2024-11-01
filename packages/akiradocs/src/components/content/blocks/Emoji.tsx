import React from 'react';

interface EmojiProps {
  id?: string;
  symbol: string;
  label?: string;
  align?: 'left' | 'center' | 'right';
}

export function Emoji({ id, symbol, label, align = 'left' }: EmojiProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <span id={id} role="img" aria-label={label || ''} aria-hidden={!label} className={`py-1 ${alignClass}`}>
      {symbol}
    </span>
  );
}
