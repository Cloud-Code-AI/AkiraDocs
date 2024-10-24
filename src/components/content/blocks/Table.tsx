import React from 'react';

interface TableProps {
  headers: string[];
  rows: string[][];
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function Table({ headers, rows, align = 'left' }: TableProps) {
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';
  return (
    <table className={`min-w-full bg-white border border-gray-200 ${alignClass}`}>
      <thead>
        <tr>
          {headers.map((header, index) => (
            <th key={index} className="py-2 px-4 border-b border-gray-200 bg-gray-100 text-left">
              {header}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {rows.map((row, rowIndex) => (
          <tr key={rowIndex}>
            {row.map((cell, cellIndex) => (
              <td key={cellIndex} className="py-2 px-4 border-b border-gray-200">
                {cell}
              </td>
            ))}
          </tr>
        ))}
      </tbody>
    </table>
  );
}
