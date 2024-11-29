'use client'

import React, { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow, format, parseISO, isAfter, subDays } from 'date-fns';
import { useTranslation } from '@/hooks/useTranslation';
interface TableOfContentsProps {
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
}

export function TableOfContents({ publishDate, modifiedDate, author }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);
  const [activeId, setActiveId] = useState<string>();
  const { t, locale } = useTranslation();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('h2:not([data-toc-ignore]), h3:not([data-toc-ignore]), h4:not([data-toc-ignore])'));
    setHeadings(elements as HTMLHeadingElement[]);

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            setActiveId(entry.target.id);
          }
        });
      },
      { rootMargin: '0% 0% -80% 0%' }
    );

    elements.forEach((elem) => observer.observe(elem));
    return () => observer.disconnect();
  }, []);

  const handleClick = (e: React.MouseEvent<HTMLAnchorElement>, id: string) => {
    e.preventDefault();
    const element = document.getElementById(id);
    if (element) {
      const y = element.getBoundingClientRect().top + window.pageYOffset - 72;
      window.scrollTo({ top: y, behavior: 'smooth' });
    }
  };

  const formatDate = (dateString: string) => {
    const date = parseISO(dateString);
    const weekAgo = subDays(new Date(), 7);
    
    if (isAfter(date, weekAgo)) {
      return formatDistanceToNow(date, { addSuffix: true });
    }
    
    return format(date, 'MMMM d, yyyy');
  };

  return (
    <div className="w-64 border-l border-border sticky top-16 h-[calc(100vh-4rem)] hidden xl:block">
      <ScrollArea className="h-full py-2 px-4">
        <nav>
          {(author || modifiedDate) && (
            <>
              <div className="mb-4 text-sm">
                {author && author !== 'Anonymous' && (
                  <div className="flex items-center gap-2 mb-2 p-2.5 rounded-lg bg-muted/30 backdrop-blur-sm">
                    <div className="h-7 w-7 rounded-full bg-primary/10 flex items-center justify-center">
                      <svg className="w-4 h-4 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <circle cx="12" cy="7" r="4"/>
                        <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">Author</div>
                      <div className="font-medium text-foreground">{author}</div>
                    </div>
                  </div>
                )}
                
                {modifiedDate && (
                  <div className="flex items-center gap-2.5 p-2 rounded-md hover:bg-muted/40 transition-colors">
                    <div className="h-6 w-6 rounded-md bg-primary/10 flex items-center justify-center">
                      <svg className="w-3.5 h-3.5 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                        <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                      </svg>
                    </div>
                    <div>
                      <div className="text-xs text-muted-foreground">{t('common.labels.updatedAt')}</div>
                      <time className="text-sm font-medium text-foreground" dateTime={modifiedDate}>
                        {formatDate(modifiedDate)}
                      </time>
                    </div>
                  </div>
                )}
              </div>
              <div className="h-px bg-border/60 my-4" />
            </>
          )}

          <h4 className="text-sm font-semibold mb-4 text-foreground flex items-center gap-2" data-toc-ignore>
            <svg className="w-4 h-4 text-primary" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
              <path d="M4 6h16M4 12h16M4 18h7" />
            </svg>
            {t('common.labels.onThisPage')}
          </h4>

          <ul className="space-y-2 ml-1">
            {headings.map((heading) => {
              const level = parseInt(heading.tagName[1]) - 2;
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={`
                      text-sm block py-1.5 transition-colors duration-200 rounded-md
                      ${level > 0 ? 'pl-' + (level * 4) : ''}
                      ${
                        activeId === heading.id
                          ? 'text-primary font-medium bg-primary/5'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40'
                      }
                    `}
                  >
                    {heading.textContent}
                  </a>
                </li>
              );
            })}
          </ul>
        </nav>
      </ScrollArea>
    </div>
  )
}

export default React.memo(TableOfContents);
