import { TableOfContents } from './TableOfContents';
import Navigation from './Navigation';

interface ContentLayoutProps {
  children: React.ReactNode;
  navigation?: Record<string, NavItem>;
  showToc?: boolean;
  currentPath?: string;
}

export function ContentLayout({
  children,
  navigation,
  showToc = true,
  currentPath
}: ContentLayoutProps) {
  return (
    <div className="flex min-h-screen">
      {/* Left Sidebar Navigation */}
      {navigation && (
        <div className="w-64 border-r border-gray-200 dark:border-gray-800">
          <Navigation items={navigation} currentPath={currentPath} />
        </div>
      )}
      
      {/* Main Content */}
      <main className="flex-1 px-6 py-8 mx-auto max-w-4xl">
        <article className="prose dark:prose-invert max-w-none">
          {children}
        </article>
      </main>

      {/* Right Sidebar TOC */}
      {showToc && (
        <div className="w-64 border-l border-gray-200 dark:border-gray-800">
          <TableOfContents />
        </div>
      )}
    </div>
  );
}