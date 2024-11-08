import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Image } from '@/components/blocks/ImageBlock';
import { ErrorBoundary } from 'react-error-boundary';

interface MarkdownRendererProps {
  content: string;
}

function MarkdownErrorFallback({ error }: { error: Error }) {
  return (
    <div className="p-4 border border-yellow-200 rounded-md bg-yellow-50 dark:bg-yellow-900/10">
      <p className="text-sm text-yellow-600 dark:text-yellow-400">
        Failed to render markdown content
      </p>
    </div>
  )
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
    <ErrorBoundary FallbackComponent={MarkdownErrorFallback}>
      <ReactMarkdown
        components={{
          code({ inline, className, children, ...props }: any) {
            const match = /language-(\w+)/.exec(className || '');
            return !inline && match ? (
              <SyntaxHighlighter
                {...props}
                PreTag="div"
                children={String(children).replace(/\n$/, '')}
                language={match[1]}
                style={dark}
              />
            ) : (
              <code className={className} {...props}>
                {children}
              </code>
            );
          },
          img: ({ node, ...props }) => (
            <Image
              src={props.src!}
              alt={props.alt!}
              caption={props.title}
            />
          )
        }}
      >
        {content}
      </ReactMarkdown>
    </ErrorBoundary>
  );
}
