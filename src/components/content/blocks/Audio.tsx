import React from 'react';

interface AudioProps {
  src: string;
  caption?: string;
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function Audio({ src, caption, align = 'left' }: AudioProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div className={`mb-6 ${alignClass}`}>
      <audio controls className="w-full">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {caption && <p className="text-sm text-gray-500">{caption}</p>}
    </div>
  );
}
