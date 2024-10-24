import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  align?: 'left' | 'center' | 'right'; // Add align prop
}

export function CodeBlock({
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  align = 'left'
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`relative group rounded-lg overflow-hidden py-1 ${alignClass}`}>
      {filename && (
        <div className="bg-gray-800 px-4 py-2 text-sm text-gray-200">
          {filename}
        </div>
      )}
      
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 p-2 rounded-lg bg-gray-800 opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>

      <SyntaxHighlighter
        language={language}
        style={oneDark}
        showLineNumbers={showLineNumbers}
        customStyle={{
          margin: 0,
          borderRadius: filename ? '0' : '0.5rem'
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}
