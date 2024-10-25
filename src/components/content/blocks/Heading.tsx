import React from 'react';
import { cn } from "@/lib/utils";

interface HeadingProps {
  level: number;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
}

export function Heading({ level, children, align = 'left', styles }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClasses = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  };
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : '';

  return (
    <Tag className={cn(
      `font-bold mt-6 mb-2 py-4 ${sizeClasses[level as keyof typeof sizeClasses]} ${alignClass}`,
      styles?.italic && 'italic',
      styles?.underline && 'underline'
    )}>
      {children}
    </Tag>
  );
}

export function MainTitle({ children, align = 'left', styles }: { children: React.ReactNode, align?: 'left' | 'center' | 'right', styles?: { bold?: boolean; italic?: boolean; underline?: boolean; } }) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : '';
  return (
    <h1 className={cn(
      `text-4xl font-bold text-gray-800 mb-1 py-1 ${alignClass}`,
      styles?.italic && 'italic',
      styles?.underline && 'underline'
    )}>
      {children}
    </h1>
  );
}
