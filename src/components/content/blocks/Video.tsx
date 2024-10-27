import React from 'react';
import { cn } from "@/lib/utils";

interface VideoProps {
  id?: string;
  src: string;
  caption?: string;
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function Video({ id, src, caption, align = 'left', styles }: VideoProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div id={id} className={`mb-6 py-1 ${alignClass}`}>
      <video controls className="w-full">
        <source src={src} type="video/mp4" />
        Your browser does not support the video tag.
      </video>
      {caption && <p className={cn(
        "text-sm text-gray-500",
        styles?.bold && 'font-bold',
        styles?.italic && 'italic',
        styles?.underline && 'underline'
      )}>{caption}</p>}
    </div>
  );
}
