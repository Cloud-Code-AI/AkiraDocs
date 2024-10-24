import React from 'react';

interface VideoProps {
  src: string;
  caption?: string;
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function Video({ src, caption, align = 'left' }: VideoProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div className={`mb-6 py-1 ${alignClass}`}>
      <video controls className="w-full">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {caption && <p className="text-sm text-gray-500">{caption}</p>}
    </div>
  );
}
