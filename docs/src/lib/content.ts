import { Post } from '@/types/Block'

// Create a function to get the JSON path
async function getJsonContent(path: string) {
  try {
    // Dynamic import for JSON files
    // console.log(path)
    const content = await import(`../../compiled/${path}`);
    return content.default;
  } catch (error) {
    console.error(`Error loading content for ${path}:`, error);
    return null;
  }
}

export async function getContentBySlug(locale: string, type: string, slug: string): Promise<Post | null> {
  try {
    const content = await getJsonContent(`${locale}/${type}/${slug}.json`);
    if (!content) return null;
    
    return {
      ...content,
      slug
    };
  } catch (error) {
    console.error(`Error reading file: ${locale}/${type}/${slug}.json`, error);
    return null;
  }
}

export async function getAllPosts(locale: string, type: string): Promise<Post[]> {
  // You'll need to maintain a manifest file that lists all available content
  // For example, create a manifest.json in your compiled directory
  const manifest = await import('../../compiled/manifest.json');
  
  const posts = await Promise.all(
    manifest.files
      .filter((fileName: string) => {
        const pattern = new RegExp(`^${locale}/${type}/[^/]+\.json$`);
        return pattern.test(fileName) && !fileName.endsWith('/_meta.json');
      })
      .map(async (fileName: string) => {
        const content = await getJsonContent(fileName);
        if (!content) return null;
        
        const slug = fileName
          .replace(`${locale}/${type}/`, '')
          .replace(/\.json$/, '');
          
        return {
          ...content,
          slug
        };
      })
  );

  return posts.filter((post): post is Post => post !== null);
}

export async function getContentNavigation<T>(defaultValue: T, locale: string, type: string): Promise<T> {
  try {
    const navigationFile = `${locale}/${type}/_meta.json`
    const navigation = await getJsonContent(navigationFile)
    // console.log(navigation)
    return navigation
  } catch (error) {
    console.warn(`Failed to read ${type} _meta.json file. Using default value.`)
    return defaultValue
  }
}

export async function getRecentContent(folderPath: string) {
  try {
    // For non-article paths, get default route from _meta.json
    // if (!folderPath.includes('/articles/')) {
      const metaContent = await getJsonContent(`${folderPath}/_meta.json`)
      if (metaContent?.defaultRoute) {
        return {
          slug: metaContent.defaultRoute
        }
      }
    // }

    // // Existing logic for articles
    // const metaContent = await getJsonContent(`${folderPath}/_meta.json`)
    // const files = metaContent?.filter((key: string) => 
    //   key.startsWith(`./${folderPath}/`) && 
    //   key.endsWith('.json') && 
    //   !key.endsWith('/_meta.json')
    // )

    // if (!files || files.length === 0) {
    //   return null
    // }

    // // Sort files by their content's date field
    // const sortedFiles = await Promise.all(
    //   files
    //     .map(async (file: string) => ({
    //       name: file,
    //       content: await getJsonContent(file)
    //     }))
    //     .sort((a: any, b: any) => new Date(b.content.date).getTime() - new Date(a.content.date).getTime())
    // )
    // console.log("sortedFiles", sortedFiles)
    // return {
    //   slug: sortedFiles[0].name.replace(`./${folderPath}/`, '').replace('.json', '')
    // }
  } catch (error) {
    console.error('Error finding recent article:', error)
    return null
  }
}

export async function get_api_spec(): Promise<any> {
  try {
    return await getJsonContent('en/api/apiSpec.json')
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

export async function getApiNavigation(): Promise<ApiNavItem[]> {
  try {
    const apiSpec = await get_api_spec();
    // console.log("apiSpec", apiSpec)
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
