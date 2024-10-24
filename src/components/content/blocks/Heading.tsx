import React from 'react';

interface HeadingProps {
  level: number;
  children: React.ReactNode;
}

export function Heading({ level, children }: HeadingProps) {
  const Tag = `h${level}` as keyof JSX.IntrinsicElements;
  const sizeClasses = {
    1: 'text-4xl',
    2: 'text-3xl',
    3: 'text-2xl',
    4: 'text-xl',
    5: 'text-lg',
    6: 'text-base',
  };

  return (
    <Tag className={`font-bold mt-6 mb-2 text-center ${sizeClasses[level as keyof typeof sizeClasses]}`}>
      {children}
    </Tag>
  );
}

export function MainTitle({ children }: { children: React.ReactNode }) {
  return (
    <h1 className="text-4xl font-bold text-center text-gray-800 mb-1">
      {children}
    </h1>
  );
}
