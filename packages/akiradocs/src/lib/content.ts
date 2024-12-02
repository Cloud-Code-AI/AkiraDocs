import { Post } from '@/types/Block'
declare var require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): any;
};
const contentContext = require.context(`../../compiled/`, true, /\.json$/)

export function getContentBySlug(locale: string, type: string, slug: string): Post | null {
  try {
    // Construct the exact path we're looking for
    const filePath = `./${locale}/${type}/${slug}.json`;
    
    // Check if the file exists in our context
    if (!contentContext.keys().includes(filePath)) {
      console.warn(`File not found: ${filePath}`);
      return null;
    }

    // Load the content
    const content = contentContext(filePath);
    return {
      ...content,
      slug
    };
  } catch (error) {
    console.error(`Error reading file: ${locale}/${type}/${slug}.json`, error);
    return null;
  }
}

export function getAllPosts(locale: string, type: string): Post[] {
  const posts = contentContext.keys()
    .filter((fileName: string) => {
      // Only include files that match the exact locale and type path
      const pattern = new RegExp(`^\./${locale}/${type}/[^/]+\.json$`);
      return pattern.test(fileName) && !fileName.endsWith('/_meta.json');
    })
    .map((fileName: string) => {
      try {
        // Load the content directly using the full path
        const content = contentContext(fileName);
        const slug = fileName
          .replace(`\./${locale}/${type}/`, '')
          .replace(/\.json$/, '');
        return {
          ...content,
          slug
        };
      } catch (error) {
        console.error(`Error loading content for ${fileName}:`, error);
        return null;
      }
    })
    .filter((post: unknown): post is Post => post !== null);

  return posts;
}

export function getContentNavigation<T>(defaultValue: T, locale: string, type: string): T {
  try {
    const navigationFile = `./${locale}/${type}/_meta.json`
    const navigation = contentContext(navigationFile) as T

    if (type === 'articles') {
      // Get all articles and their content
      const articles = contentContext.keys()
        .filter((key: string) => key.startsWith(`./${locale}/${type}/`) && !key.endsWith('/_meta.json'))
        .map((key: string) => ({
          path: key.replace(`./${locale}/${type}/`, '').replace('.json', ''),
          content: contentContext(key)
        }))
        .sort((a: any, b: any) => new Date(b.content.date).getTime() - new Date(a.content.date).getTime())

      // Assuming navigation is an object with a routes property
      return {
        ...navigation
      } as T
    }

    return navigation
  } catch (error) {
    console.warn(`Failed to read ${type} _meta.json file. Using default value.`)
    return defaultValue
  }
}

export function getRecentContent(folderPath: string) {
  try {
    // For non-article paths, get default route from _meta.json
    if (!folderPath.includes('/articles/')) {
      const metaContent = contentContext(`./${folderPath}/_meta.json`)
      if (metaContent?.defaultRoute) {
        return {
          slug: metaContent.defaultRoute
        }
      }
    }

    // Existing logic for articles
    const files = contentContext.keys()
      .filter((key: string) => key.startsWith(`./${folderPath}/`) && key.endsWith('.json') && !key.endsWith('/_meta.json'))

    if (files.length === 0) {
      return null
    }

    // Sort files by their content's date field
    const sortedFiles = files
      .map((file: string) => ({
        name: file,
        content: contentContext(file)
      }))
      .sort((a: any, b: any) => new Date(b.content.date).getTime() - new Date(a.content.date).getTime())

    return {
      slug: sortedFiles[0].name.replace(`./${folderPath}/`, '').replace('.json', '')
    }
  } catch (error) {
    console.error('Error finding recent article:', error)
    return null
  }
}

export function folderExists(folderPath: string): boolean {
  try {
    return contentContext.keys().some((key: string) => key.startsWith(`./${folderPath}/`))
  } catch (error) {
    console.error('Error checking folder existence:', error)
    return false
  }
}
export function get_api_spec(): any {
  try {
    return contentContext('./en/api/apiSpec.json')
  } catch (error) {
    console.error('Error reading API spec file:', error)
    return null
  }
}

interface ApiNavItem {
  title: string;
  path: string;
  method: string;
  children?: ApiNavItem[];
}

export function getApiNavigation(): ApiNavItem[] {
  try {
    const apiSpec = get_api_spec();
    if (!apiSpec || !apiSpec.paths) {
      return [];
    }

    const navigation: ApiNavItem[] = [];

    // Process each path in the API spec
    Object.entries(apiSpec.paths).forEach(([path, pathData]: [string, any]) => {
      // Process each HTTP method for the path
      Object.entries(pathData).forEach(([method, methodData]: [string, any]) => {
        navigation.push({
          title: methodData.summary || `${method.toUpperCase()} ${path}`,
          path: path,
          method: method.toUpperCase(),
          children: methodData.parameters?.map((param: any) => ({
            title: param.name,
            path: `${path}#${param.name}`,
            method: 'PARAM'
          })) || []
        });
      });
    });

    return navigation;
  } catch (error) {
    console.error('Error generating API navigation:', error);
    return [];
  }
}
