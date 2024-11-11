import { NavItem } from "../types/navigation";

function flattenNavigation(items: Record<string, NavItem>): { title: string; path: string }[] {
  const flattened: { title: string; path: string }[] = [];

  function traverse(item: NavItem) {
    if (item.path) {
      flattened.push({ title: item.title, path: item.path });
    }
    if (item.items) {
      Object.values(item.items).forEach(traverse);
    }
  }

  Object.values(items).forEach(traverse);
  return flattened;
}

export function getNextPrevPages(items: Record<string, NavItem>, currentPath: string) {
  const flattenedPages = flattenNavigation(items);
  const currentIndex = flattenedPages.findIndex(page => page.path === currentPath);
  console.log(flattenedPages, currentIndex)
  return {
    prev: currentIndex > 0 ? flattenedPages[currentIndex - 1] : null,
    next: currentIndex < flattenedPages.length - 1 ? flattenedPages[currentIndex + 1] : null,
  };
} 