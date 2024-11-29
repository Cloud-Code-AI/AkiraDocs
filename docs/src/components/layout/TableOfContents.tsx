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
          
          {(publishDate || modifiedDate || author) && (
            <div className="mb-6 text-sm border-b border-border/40 pb-4">
              {author && author !== 'Anonymous' && (
                <div className="flex items-center gap-2 text-muted-foreground mb-2">
                  <span className="flex items-center gap-1.5 hover:text-foreground transition-colors">
                    <svg className="w-3.5 h-3.5" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <circle cx="12" cy="7" r="4"/>
                      <path d="M19 21v-2a4 4 0 0 0-4-4H9a4 4 0 0 0-4 4v2"/>
                    </svg>
                    {author}
                  </span>
                </div>
              )}
              
              <div className="flex flex-col gap-1.5 text-xs text-muted-foreground/70">
                {publishDate && (
                  <time className="flex items-center gap-1.5" dateTime={publishDate}>
                    <svg className="w-3.5 h-3.5 text-muted-foreground/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <rect x="3" y="4" width="18" height="18" rx="2" ry="2"/>
                      <line x1="16" y1="2" x2="16" y2="6"/>
                      <line x1="8" y1="2" x2="8" y2="6"/>
                      <line x1="3" y1="10" x2="21" y2="10"/>
                    </svg>
                    {t('common.labels.publishedAt')}: {formatDate(publishDate)}
                  </time>
                )}
                
                {/* {modifiedDate && (
                  <time className="flex items-center gap-1.5" dateTime={modifiedDate}>
                    <svg className="w-3.5 h-3.5 text-muted-foreground/60" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                      <path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/>
                    </svg>
                    {t('common.labels.updatedAt')}: {formatDate(modifiedDate)}
                  </time>
                )} */}
              </div>
            </div>
          )}

          <h4 className="text-sm font-semibold mb-4 text-foreground" data-toc-ignore>
            {t('common.labels.onThisPage')}
          </h4>

          <ul className="space-y-2">
            {headings.map((heading) => {
              const level = parseInt(heading.tagName[1]) - 2;
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={`
                      text-sm block py-1 transition-colors duration-200
                      ${level > 0 ? 'pl-' + (level * 4) : ''}
                      ${
                        activeId === heading.id
                          ? 'text-primary font-medium'
                          : 'text-muted-foreground hover:text-foreground'
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
