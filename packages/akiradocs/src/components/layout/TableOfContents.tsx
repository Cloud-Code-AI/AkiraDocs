'use client'

import React, { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"
import { formatDistanceToNow, format, parseISO, isAfter, subDays } from 'date-fns';
import { getTranslation, locales } from '@/lib/staticTranslation';
interface TableOfContentsProps {
  publishDate?: string;
  modifiedDate?: string;
  author?: string;
  locale: string;
}

export function TableOfContents({ publishDate, modifiedDate, author, locale }: TableOfContentsProps) {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);
  const [activeId, setActiveId] = useState<string>();
  const t = getTranslation(locale as keyof typeof locales);

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('h2:not([data-toc-ignore]), h3:not([data-toc-ignore]), h4:not([data-toc-ignore]), h5:not([data-toc-ignore])'));
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
      <ScrollArea className="h-full py-6 px-4">
        <nav className="space-y-2">
          {(author || modifiedDate) && (
            <>
              <div className="mb-6">
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

          <ul className="space-y-2">
            {headings.map((heading) => {
              const level = parseInt(heading.tagName[1]) - 1;
              const indentClass = {
                0: '',
                1: 'ml-3',  // h2
                2: 'ml-6', // h3
                3: 'ml-9', // h4
                4: 'ml-12', // h5
                5: 'ml-15', // h6
              }[level] || '';

              console.log(heading.textContent, level, indentClass);
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
                    onClick={(e) => handleClick(e, heading.id)}
                    className={`
                      text-sm block px-3 py-2 rounded-md
                      ${indentClass}
                      transition-all duration-200 ease-in-out
                      relative
                      before:absolute before:left-0 before:top-1/2 before:-translate-y-1/2 
                      before:h-4 before:w-0.5 before:bg-primary before:opacity-0
                      before:transition-all before:duration-200
                      hover:before:opacity-100
                      ${
                        activeId === heading.id
                          ? 'text-primary font-medium bg-primary/5 before:opacity-100'
                          : 'text-muted-foreground hover:text-foreground hover:bg-muted/40 hover:translate-x-1'
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
