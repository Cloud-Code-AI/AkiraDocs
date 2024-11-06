import ReactMarkdown from 'react-markdown';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { dark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Image } from 'akiradocs-ui';

interface MarkdownRendererProps {
  content: string;
}

export function MarkdownRenderer({ content }: MarkdownRendererProps) {
  return (
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
  );
}
