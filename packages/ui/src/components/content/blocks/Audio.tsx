import React from 'react';
import { cn } from "@/components/utils";

interface AudioProps {
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

export function Audio({ id, src, caption, align = 'left', styles }: AudioProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <div id={id} className={`mb-6 py-1 ${alignClass}`}>
      <audio controls className="w-full bg-background border border-border rounded-md">
        <source src={src} type="audio/mpeg" />
        <span className="text-muted-foreground">Your browser does not support the audio element.</span>
      </audio>
      {caption && <p className={cn(
        "mt-2 text-sm text-muted-foreground",
        styles?.bold && 'font-bold',
        styles?.italic && 'italic',
        styles?.underline && 'underline'
      )}>{caption}</p>}
    </div>
  );
}
