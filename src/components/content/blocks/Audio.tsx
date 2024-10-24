import React from 'react';

interface AudioProps {
  src: string;
  caption?: string;
}

export function Audio({ src, caption }: AudioProps) {
  return (
    <div className="mb-6">
      <audio controls className="w-full">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {caption && <p className="text-center text-sm text-gray-500">{caption}</p>}
    </div>
  );
}
