import React from 'react';

interface EmojiProps {
  symbol: string;
  label?: string;
}

export function Emoji({ symbol, label }: EmojiProps) {
  return (
    <span role="img" aria-label={label || ''} aria-hidden={!label}>
      {symbol}
    </span>
  );
}
