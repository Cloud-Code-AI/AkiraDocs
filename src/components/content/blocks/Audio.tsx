import React from 'react';
import { cn } from "@/lib/utils";

interface AudioProps {
  src: string;
  caption?: string;
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function Audio({ src, caption, align = 'left', styles }: AudioProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div className={`mb-6 py-1 ${alignClass}`}>
      <audio controls className="w-full">
        <source src={src} type="audio/mpeg" />
        Your browser does not support the audio element.
      </audio>
      {caption && <p className={cn(
        "text-sm text-gray-500",
        styles?.bold && 'font-bold',
        styles?.italic && 'italic',
        styles?.underline && 'underline'
      )}>{caption}</p>}
    </div>
  );
}
