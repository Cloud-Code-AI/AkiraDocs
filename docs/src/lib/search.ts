declare var require: {
    context(
      directory: string,
      useSubdirectories: boolean,
      regExp: RegExp
    ): any;
  };
const contentContext = require.context(`../../compiled/`, true, /\.json$/)

export type SearchResult = {
  title: string;
  path: string;
  type: 'articles' | 'docs';
  excerpt?: string;
  matchScore?: number;
}

export class ContentSearch {
  private locale: string;

  constructor(locale: string = 'en') {
    this.locale = locale;
  }

  public search(query: string, limit: number = 10): SearchResult[] {
    if (!query.trim()) return [];
    
    const searchTerm = query.toLowerCase();
    const results: SearchResult[] = [];

    try {
      // Search in articles
      this.searchInType('articles', searchTerm, results);
      
      // Search in docs
      this.searchInType('docs', searchTerm, results);

      // Sort results by match score
      return results
        .sort((a, b) => (b.matchScore || 0) - (a.matchScore || 0))
        .slice(0, limit);

    } catch (error) {
      console.error('Search error:', error);
      return [];
    }
  }

  private searchInType(type: 'articles' | 'docs', searchTerm: string, results: SearchResult[]) {
    try {
      const metaFile = `./${this.locale}/${type}/_meta.json`;
      const meta = contentContext(metaFile);

      this.searchInItems(meta, type, searchTerm, results);
    } catch (error) {
      console.warn(`Failed to search in ${type}`, error);
    }
  }

  private searchInItems(
    items: any, 
    type: 'articles' | 'docs', 
    searchTerm: string, 
    results: SearchResult[], 
    parentPath: string = ''
  ) {
    Object.entries(items).forEach(([key, value]: [string, any]) => {
      // Skip technical keys
      if (key === 'defaultRoute') return;

      if (typeof value === 'object') {
        // If it's a direct content item
        if (value.title && value.path) {
          const matchScore = this.calculateMatchScore(value.title, searchTerm);
          if (matchScore > 0) {
            results.push({
              title: value.title,
              path: value.path,
              type: type,
              matchScore
            });
          }
        }

        // If it has nested items, search them too
        if (value.items) {
          const newParentPath = parentPath ? `${parentPath}/${key}` : key;
          this.searchInItems(value.items, type, searchTerm, results, newParentPath);
        }
      }
    });
  }

  private calculateMatchScore(title: string, searchTerm: string): number {
    const normalizedTitle = title.toLowerCase();
    
    // Exact match gets highest score
    if (normalizedTitle === searchTerm) return 100;
    
    // Starting with search term gets high score
    if (normalizedTitle.startsWith(searchTerm)) return 75;
    
    // Contains search term gets medium score
    if (normalizedTitle.includes(searchTerm)) return 50;
    
    // Words that contain the search term get lower score
    const words = normalizedTitle.split(' ');
    if (words.some(word => word.includes(searchTerm))) return 25;
    
    return 0;
  }
}

// Create a singleton instance
const defaultSearch = new ContentSearch();

// Export convenient search function
export function searchContent(query: string, limit?: number): SearchResult[] {
  return defaultSearch.search(query, limit);
}

// Add this helper function to extract locale from path
export function getLocaleFromPath(path: string): string {
  const match = path.match(/^\/([a-z]{2})\//);
  return match ? match[1] : 'en'; // default to 'en' if no locale found
} 