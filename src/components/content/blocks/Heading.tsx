import React from 'react';

interface HeadingProps {
  level: number;
  children: React.ReactNode;
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function Heading({ level, children, align = 'left' }: HeadingProps) {
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
    <Tag className={`font-bold mt-6 mb-2 py-4 ${sizeClasses[level as keyof typeof sizeClasses]} ${alignClass}`}>
      {children}
    </Tag>
  );
}

export function MainTitle({ children, align = 'left' }: { children: React.ReactNode, align?: 'left' | 'center' | 'right' }) {
  const alignClass = align === 'center' ? 'text-center' : align === 'right' ? 'text-right' : '';
  return (
    <h1 className={`text-4xl font-bold text-gray-800 mb-1 py-1 ${alignClass}`}>
      {children}
    </h1>
  );
}
