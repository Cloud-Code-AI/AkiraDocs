import { useState } from 'react';
import { Check, Copy } from 'lucide-react';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';

interface CodeBlockProps {
  id?: string;
  code: string;
  language?: string;
  filename?: string;
  showLineNumbers?: boolean;
  align?: 'left' | 'center' | 'right';
  isEditing?: boolean;
  onUpdate?: (content: string) => void;
}

export function CodeBlock({
  id,
  code,
  language = 'typescript',
  filename,
  showLineNumbers = true,
  align = 'left',
  isEditing = false,
  onUpdate
}: CodeBlockProps) {
  const [copied, setCopied] = useState(false);
  const alignClass = align === 'center' ? 'mx-auto' : align === 'right' ? 'ml-auto' : '';

  const copyToClipboard = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  if (!isEditing) {
    return (
      <div id={id} className={`relative group rounded-lg overflow-hidden py-1 ${alignClass}`}>
        {filename && (
          <div className="bg-secondary px-4 py-2 text-sm text-secondary-foreground">
            {filename}
          </div>
        )}
        
        <button
          onClick={copyToClipboard}
          className="absolute right-2 top-2 p-2 rounded-lg bg-secondary text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
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

  return (
    <div id={id} className={`relative group rounded-lg overflow-hidden py-1 ${alignClass}`}>
      {filename && (
        <div className="bg-secondary px-4 py-2 text-sm text-secondary-foreground">
          {filename}
        </div>
      )}
      
      <button
        onClick={copyToClipboard}
        className="absolute right-2 top-2 p-2 rounded-lg bg-secondary text-secondary-foreground opacity-0 group-hover:opacity-100 transition-opacity"
      >
        {copied ? <Check size={16} /> : <Copy size={16} />}
      </button>

      <div className="relative min-h-[55px]">
        <div className="pointer-events-none h-full">
          <SyntaxHighlighter
            language={language}
            style={oneDark}
            showLineNumbers={showLineNumbers}
            customStyle={{
              margin: 0,
              padding: '1rem',
              borderRadius: filename ? '0' : '0.5rem',
              height: '100%'
            }}
          >
            {code}
          </SyntaxHighlighter>
        </div>

        <pre
          contentEditable
          suppressContentEditableWarning
          onBlur={(e) => {
            const target = e.target as HTMLElement;
            if (!target) return;
            
            let content = target.innerHTML;
            content = content.replace(/<div><br><\/div>/g, '\n')
            content = content.replace(/<div>/g, '\n')
            content = content.replace(/<\/div>/g, '')
            content = content.replace(/<br>/g, '\n')
            content = content.replace(/<br\/>/g, '\n')
            content = content.replace(/&nbsp;/g, ' ')
            content = content.replace(/\n\n+/g, '\n\n')
            content = content.trim()
            
            onUpdate?.(content);
          }}
          className="absolute inset-0 m-0 whitespace-pre-wrap bg-[#282c34] focus:bg-[#282c34] focus:opacity-100 opacity-0 focus:outline-none h-full"
          style={{
            ...oneDark['pre[class*="language-"]'],
            ...oneDark['code[class*="language-"]'],
            padding: '1rem',
            margin: 0,
            lineHeight: 'inherit'
          }}
          dangerouslySetInnerHTML={{ __html: code.replace(/\n/g, '<br>') }}
        />
      </div>
    </div>
  );
}
