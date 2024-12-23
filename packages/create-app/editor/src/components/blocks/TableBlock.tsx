import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Button } from '@/components/ui/button';
import { Plus, Minus } from 'lucide-react';

interface TableProps {
  id?: string;
  headers: string[];
  rows: string[][];
  align?: 'left' | 'center' | 'right';
  styles?: {
    bold?: boolean;
    italic?: boolean;
    underline?: boolean;
  };
  isEditing?: boolean;
  onChange?: (headers: string[], rows: string[][]) => void;
}

export function Table({ id, headers, rows, align = 'left', styles, isEditing = false, onChange }: TableProps) {
  const [isFocused, setIsFocused] = useState(false);

  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';

  const handleCellChange = (rowIndex: number, colIndex: number, value: string) => {
    if (!onChange) return;

    if (rowIndex === -1) {
      const newHeaders = [...headers];
      newHeaders[colIndex] = value;
      onChange(newHeaders, rows);
    } else {
      const newRows = rows.map((row, i) =>
        i === rowIndex ? row.map((cell, j) => (j === colIndex ? value : cell)) : row
      );
      onChange(headers, newRows);
    }
  };

  const addColumn = () => {
    if (!onChange) return;
    const newHeaders = [...headers, 'New Column'];
    const newRows = rows.map(row => [...row, '']);
    onChange(newHeaders, newRows);
  };

  const addRow = () => {
    if (!onChange) return;
    const newRow = new Array(headers.length).fill('');
    onChange(headers, [...rows, newRow]);
  };

  const removeColumn = (colIndex: number) => {
    if (!onChange || headers.length <= 1) return;
    const newHeaders = headers.filter((_, i) => i !== colIndex);
    const newRows = rows.map(row => row.filter((_, i) => i !== colIndex));
    onChange(newHeaders, newRows);
  };

  const removeRow = (rowIndex: number) => {
    if (!onChange || rows.length <= 1) return;
    const newRows = rows.filter((_, i) => i !== rowIndex);
    onChange(headers, newRows);
  };

  return (
    <div
      id={id}
      className={`py-1 mb-6 ${alignClass} relative group`}
      onFocus={() => setIsFocused(true)}
      onBlur={() => setIsFocused(false)}
      tabIndex={0}
    >
      <table className={cn(
        "min-w-full bg-background border border-border relative",
        styles?.bold && 'font-bold',
        styles?.italic && 'italic',
        styles?.underline && 'underline',
        isEditing && 'group/table'
      )}>
        <thead>
          <tr>
            {headers.map((header, colIndex) => (
              <th key={colIndex} className={cn(
                "py-2 px-4 border-b border-border bg-muted text-left text-muted-foreground relative",
                isEditing && "pr-12"
              )}>
                <div className="flex items-center gap-2">
                  {isEditing ? (
                    <input
                      type="text"
                      value={header}
                      onChange={(e) => handleCellChange(-1, colIndex, e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                    />
                  ) : (
                    <div className="break-words whitespace-pre-wrap">{header}</div>
                  )}
                  {isEditing && isFocused && headers.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 opacity-0 group-hover/table:opacity-100 transition-opacity hover:bg-gray-200 hover:text-gray-700 p-0 h-6 w-6"
                      onClick={() => removeColumn(colIndex)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </div>
              </th>
            ))}
            {isEditing && isFocused && (
              <th className="w-10 border-b border-border bg-muted">
                <Button
                  variant="ghost"
                  size="sm"
                  className="p-0 h-8 w-8 hover:bg-gray-200"
                  onClick={addColumn}
                >
                  <Plus className="h-4 w-4" />
                </Button>
              </th>
            )}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex} className={cn(
                  "py-2 px-4 border-b border-border text-foreground relative",
                  isEditing && colIndex === row.length - 1 && "pr-12"
                )}>
                  {isEditing ? (
                    <input
                      type="text"
                      value={cell}
                      onChange={(e) => handleCellChange(rowIndex, colIndex, e.target.value)}
                      className="w-full bg-transparent focus:outline-none"
                    />
                  ) : (
                    <div className="break-words whitespace-pre-wrap">{cell}</div>
                  )}
                  {isEditing && isFocused && colIndex === row.length - 1 && rows.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute right-2 opacity-0 group-hover/table:opacity-100 transition-opacity hover:bg-gray-200 hover:text-gray-700 p-0 h-6 w-6"
                      onClick={() => removeRow(rowIndex)}
                    >
                      <Minus className="h-4 w-4" />
                    </Button>
                  )}
                </td>
              ))}
              {isEditing && isFocused && (
                <td className="w-10 border-b border-border">
                  {rowIndex === rows.length - 1 ? (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="p-0 h-8 w-8 hover:bg-gray-200"
                      onClick={addRow}
                    >
                      <Plus className="h-4 w-4" />
                    </Button>
                  ) : null}
                </td>
              )}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
