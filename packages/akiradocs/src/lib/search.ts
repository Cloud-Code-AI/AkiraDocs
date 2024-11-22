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
  contentMatch?: string;
  matchType?: 'title' | 'description' | 'content' | 'keywords';
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

      // Split search term into words and filter out empty strings
      const searchWords = searchTerm.toLowerCase().split(/\s+/).filter(Boolean);
      if (searchWords.length === 0) return;

      Object.entries(meta).forEach(([key, value]: [string, any]) => {
        if (key === 'defaultRoute') return;

        if (typeof value === 'object' && value.path) {
          try {
            const contentFile = `./${this.locale}${value.path}.json`;
            const content = contentContext(contentFile);
            
            let matchScore = 0;
            let contentMatch = '';
            
            // Helper function to search in text
            const searchInText = (text: string): boolean => {
              if (!text) return false;
              // Split content by newlines and spaces to handle list items
              const words = text.toLowerCase().split(/[\s\n]+/);
              return searchWords.some(searchWord => 
                words.some(word => word.includes(searchWord))
              );
            };

            // Search in blocks content
            if (content.blocks) {
              content.blocks.forEach((block: any) => {
                if (block.content) {
                  // For list blocks, split by newlines
                  const contentToSearch = block.type === 'list' 
                    ? block.content.split('\n').join(' ')
                    : block.content;

                  if (searchInText(contentToSearch)) {
                    matchScore += 40;
                    const context = this.getMatchContext(contentToSearch, searchWords);
                    if (context) {
                      contentMatch = context;
                    }
                  }
                }

                // Search in metadata
                if (block.metadata) {
                  Object.values(block.metadata).forEach((value: any) => {
                    if (typeof value === 'string' && searchInText(value)) {
                      matchScore += 20;
                    }
                  });
                }
              });
            }

            // Search in metadata fields
            if (searchInText(content.title)) matchScore += 50;
            if (searchInText(content.description)) matchScore += 30;
            if (content.keywords?.some((k: string) => searchInText(k))) matchScore += 30;

            if (matchScore > 0) {
              results.push({
                title: content.title || value.title,
                path: value.path,
                type: type,
                matchScore,
                contentMatch: contentMatch || undefined,
                excerpt: content.description
              });
            }
          } catch (error) {
            console.warn(`Failed to load content file for ${value.path}`, error);
          }
        }
      });
    } catch (error) {
      console.warn(`Failed to search in ${type}`, error);
    }
  }

  private getMatchContext(text: string, searchWords: string[]): string {
    const normalizedText = text.toLowerCase();
    let matchIndex = -1;
    let matchWord = '';

    // Find the first occurrence of any search word
    for (const word of searchWords) {
      const index = normalizedText.indexOf(word);
      if (index !== -1 && (matchIndex === -1 || index < matchIndex)) {
        matchIndex = index;
        matchWord = word;
      }
    }

    if (matchIndex === -1) return '';

    const start = Math.max(0, matchIndex - 50);
    const end = Math.min(text.length, matchIndex + matchWord.length + 50);
    return (start > 0 ? '...' : '') + text.slice(start, end) + (end < text.length ? '...' : '');
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

  private calculateMatchScore(text: string, searchTerm: string): number {
    if (!text) return 0;
    
    const normalizedText = text.toLowerCase();
    const normalizedTerm = searchTerm.toLowerCase();
    
    // Exact match gets highest score
    if (normalizedText === normalizedTerm) return 100;
    
    // Starting with search term gets high score
    if (normalizedText.startsWith(normalizedTerm)) return 80;
    
    // Contains full search term gets medium-high score
    if (normalizedText.includes(normalizedTerm)) return 60;
    
    // All search terms words appear in text (in any order)
    const searchWords = normalizedTerm.split(/\s+/);
    if (searchWords.every(word => normalizedText.includes(word))) return 50;
    
    // Some search term words appear in text
    if (searchWords.some(word => normalizedText.includes(word))) return 30;
    
    // Words that contain the search term get lower score
    const words = normalizedText.split(/\s+/);
    if (words.some(word => word.includes(normalizedTerm))) return 20;
    
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