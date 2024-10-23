import { useEffect, useState } from 'react';

export function TableOfContents() {
  const [headings, setHeadings] = useState<HTMLHeadingElement[]>([]);
  const [activeId, setActiveId] = useState<string>();

  useEffect(() => {
    const elements = Array.from(document.querySelectorAll('h2, h3, h4'));
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
    <nav className="sticky top-16 p-4 space-y-2">
      <h4 className="text-sm font-semibold mb-4">On this page</h4>
      {headings.map((heading) => {
        const level = parseInt(heading.tagName[1]) - 2;
        return (
          <a
            key={heading.id}
            href={`#${heading.id}`}
            className={`
              block text-sm py-1
              ${level > 0 ? 'pl-' + (level * 4) : ''}
              ${activeId === heading.id ? 'text-blue-600 dark:text-blue-400' : 'text-gray-600 dark:text-gray-400'}
              hover:text-blue-600 dark:hover:text-blue-400
            `}
          >
            {heading.textContent}
          </a>
        );
      })}
    </nav>
  );
}