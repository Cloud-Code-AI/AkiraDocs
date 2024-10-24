import React from 'react';

interface VideoProps {
  src: string;
  caption?: string;
}

export function Video({ src, caption }: VideoProps) {
  return (
    <div className="mb-6">
      <video controls className="w-full">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {caption && <p className="text-center text-sm text-gray-500">{caption}</p>}
    </div>
  );
}
