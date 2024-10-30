'use client'

import React, { useState, useEffect } from 'react'
import { ScrollArea } from "@/components/ui/scroll-area"

export function TableOfContents() {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);
  const [activeId, setActiveId] = useState<string>();

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

  return (
    <div className="w-64 border-l border-border sticky top-16 h-[calc(100vh-4rem)] hidden xl:block">
      <ScrollArea className="h-full py-6 px-4">
        <nav>
          <h4 className="text-sm font-semibold mb-4 text-foreground" data-toc-ignore>
            On This Page
          </h4>
          <ul className="space-y-2">
            {headings.map((heading) => {
              const level = parseInt(heading.tagName[1]) - 2;
              return (
                <li key={heading.id}>
                  <a
                    href={`#${heading.id}`}
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

export default TableOfContents;