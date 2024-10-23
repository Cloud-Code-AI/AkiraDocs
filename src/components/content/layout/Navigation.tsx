import Link from 'next/link';
import { ChevronDown, ChevronRight } from 'lucide-react';
import { useState } from 'react';

// Add this type definition at the top of the file
type NavItem = {
  title: string;
  path?: string;
  badge?: string;
  items?: Record<string, NavItem>;
};

interface NavItemProps {
  item: NavItem;
  isActive?: boolean;
  depth?: number;
}

function NavItem({ item, isActive, depth = 0 }: NavItemProps) {
  const [isOpen, setIsOpen] = useState(false);
  const hasChildren = item.items && Object.keys(item.items).length > 0;

  return (
    <div className="nav-item">
      <div
        className={`
          flex items-center px-4 py-2 text-sm
          ${isActive ? 'bg-gray-100 dark:bg-gray-800' : ''}
          ${depth > 0 ? 'pl-' + (depth * 4 + 4) : ''}
          hover:bg-gray-50 dark:hover:bg-gray-800
          cursor-pointer
        `}
        onClick={() => hasChildren && setIsOpen(!isOpen)}
      >
        {hasChildren && (
          <span className="mr-2">
            {isOpen ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
          </span>
        )}
        
        {item.path ? (
          <Link href={item.path} className="flex-1">
            {item.title}
          </Link>
        ) : (
          <span className="flex-1">{item.title}</span>
        )}
        
        {item.badge && (
          <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-100">
            {item.badge}
          </span>
        )}
      </div>

      {hasChildren && isOpen && (
        <div className="nav-children">
          {Object.entries(item.items!).map(([key, child]) => (
            <NavItem
              key={key}
              item={child}
              depth={depth + 1}
            />
          ))}
        </div>
      )}
    </div>
  );
}
