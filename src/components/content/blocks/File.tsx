import React from 'react';

interface FileProps {
  url: string;
  name: string;
}

export function File({ url, name }: FileProps) {
  return (
    <div className="mb-6">
      <a href={url} download className="text-blue-500 hover:underline">
        {name}
      </a>
    </div>
  );
}
