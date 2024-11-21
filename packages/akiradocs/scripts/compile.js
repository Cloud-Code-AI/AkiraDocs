const { readFile, writeFile, mkdir, readdir } = require('fs/promises');
const { glob } = require('glob');
const matter = require('gray-matter');
const path = require('path');
const { existsSync } = require('fs');

async function convertMarkdownToBlocks(content) {
  const blocks = [];
  let currentBlock = [];
  let blockId = 1;

  const lines = content.split('\n');
  
  let listItems = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    // Handle list items
    if (line.trim().startsWith('-')) {
      if (currentBlock.length > 0) {
        blocks.push({
          id: String(blockId++),
          type: 'paragraph',
          content: currentBlock.join('\n').trim()
        });
        currentBlock = [];
      }
      
      listItems.push(line.trim().substring(1).trim());
      
      // Check if next line is not a list item or if this is the last line
      if (i === lines.length - 1 || !lines[i + 1].trim().startsWith('-')) {
        blocks.push({
          id: String(blockId++),
          type: 'list',
          content: listItems,
          metadata: {
            listType: 'unordered'
          }
        });
        listItems = [];
      }
      continue;
    }

    // If we reach here and have pending list items, add them as a block
    if (listItems.length > 0) {
      blocks.push({
        id: String(blockId++),
        type: 'list',
        content: listItems,
        metadata: {
          listType: 'unordered'
        }
      });
      listItems = [];
    }

    // Handle code blocks
    if (line.startsWith('```')) {
      if (currentBlock.length > 0) {
        blocks.push({
          id: String(blockId++),
          type: 'paragraph',
          content: currentBlock.join('\n').trim()
        });
        currentBlock = [];
      }
      
      const language = line.slice(3);
      let codeContent = [];
      i++;
      
      while (i < lines.length && !lines[i].startsWith('```')) {
        codeContent.push(lines[i]);
        i++;
      }
      
      blocks.push({
        id: String(blockId++),
        type: 'code',
        content: codeContent.join('\n'),
        metadata: {
          language: language || 'plaintext',
          showLineNumbers: true
        }
      });
      continue;
    }

    // Handle headings
    if (line.startsWith('#')) {
      if (currentBlock.length > 0) {
        blocks.push({
          id: String(blockId++),
          type: 'paragraph',
          content: currentBlock.join('\n').trim()
        });
        currentBlock = [];
      }

      const match = line.match(/^#+/);
      if (!match) continue; // Skip if no match found
      
      const level = match[0].length;
      blocks.push({
        id: String(blockId++),
        type: 'heading',
        content: line.slice(level).trim(),
        metadata: { level }
      });
      continue;
    }

    // Handle callouts with > [!type] syntax
    if (line.trim().startsWith('> [!')) {
      if (currentBlock.length > 0) {
        blocks.push({
          id: String(blockId++),
          type: 'paragraph',
          content: currentBlock.join('\n').trim()
        });
        currentBlock = [];
      }

      const calloutMatch = line.match(/>\s*\[!(\w+)\]\s*(.*)/);
      if (calloutMatch) {
        const [_, type, title] = calloutMatch;
        let calloutContent = [];
        i++;

        // Collect content until we hit a line that doesn't start with >
        while (i < lines.length && lines[i].trim().startsWith('>')) {
          // Remove the > prefix and any single leading space
          calloutContent.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        i--; // Step back one line since we went too far

        blocks.push({
          id: String(blockId++),
          type: 'callout',
          content: calloutContent.join('\n').trim(),
          metadata: {
            type: type.toLowerCase(),
            title: title || type.charAt(0).toUpperCase() + type.slice(1)
          }
        });
      }
      continue;
    }

    // Accumulate regular paragraph content
    currentBlock.push(line);
  }

  // Add any remaining content as a paragraph
  if (currentBlock.length > 0) {
    blocks.push({
      id: String(blockId++),
      type: 'paragraph',
      content: currentBlock.join('\n').trim()
    });
  }

  return blocks;
}


async function updateMetaFile(folderPath, newFile) {
  const metaPath = path.join(folderPath, '_meta.json');
  let meta = {};

  if (existsSync(metaPath)) {
    const content = await readFile(metaPath, 'utf-8');
    meta = JSON.parse(content);
    console.log('Found existing meta file:', metaPath);
  }

  const fileName = path.basename(newFile, '.json');
  const compiledContent = JSON.parse(await readFile(newFile, 'utf-8'));
  
  // Calculate relative path from compiled directory
  const relativePath = path.relative(
    path.join(process.cwd(), 'compiled'),
    folderPath
  );
  
  // Only set title if the entry doesn't exist in meta
  if (!meta[fileName]) {
    const humanReadableFileName = fileName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    meta[fileName] = {
      title: compiledContent.title || humanReadableFileName,
      path: path.join('/', relativePath, fileName)
    };
  } else {
    // Update only the path, preserve the existing title
    meta[fileName].path = path.join('/', relativePath, fileName);
  }

  await writeFile(metaPath, JSON.stringify(meta, null, 2));
}

async function compileMarkdownFiles() {
  try {
    // Use path.join for the glob pattern
    const files = await glob(path.join('_contents', '**', '*.md'), { cwd: process.cwd() });
    
    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      const { data: frontmatter, content: markdownContent } = matter(content);
      
      const blocks = await convertMarkdownToBlocks(markdownContent);
      
      const compiledContent = {
        title: frontmatter.title || '',
        description: frontmatter.description || '',
        author: frontmatter.author || 'Anonymous',
        publishDate: frontmatter.publishDate || new Date().toISOString().split('T')[0],
        modifiedDate: frontmatter.modifiedDate || new Date().toISOString().split('T')[0],
        category: frontmatter.category || '',
        keywords: frontmatter.keywords || [],
        blocks
      };

      // Convert the path using path.join
      const compiledPath = file
        .replace(path.join('_contents'), path.join('compiled'))
        .replace('.md', '.json');
      
      await mkdir(path.dirname(compiledPath), { recursive: true });
      await writeFile(compiledPath, JSON.stringify(compiledContent, null, 2));
      
      await updateMetaFile(path.dirname(compiledPath), compiledPath);
      
      console.log(`Compiled ${file} -> ${compiledPath}`);
    }
  } catch (error) {
    console.error('Error compiling markdown files:', error);
    process.exit(1);
  }
}

async function createMetaFilesForAllFolders() {
  try {
    const compiledPath = path.join(process.cwd(), 'compiled');
    const languageFolders = await readdir(compiledPath);

    for (const langFolder of languageFolders) {
      const langPath = path.join(compiledPath, langFolder);
      const mainSections = ['docs', 'articles'];
      
      for (const section of mainSections) {
        const sectionPath = path.join(langPath, section);
        if (!existsSync(sectionPath)) continue;

        // Initialize existingMeta and read existing meta file if it exists
        let existingMeta = {};
        const metaPath = path.join(sectionPath, '_meta.json');
        let existingDefaultRoute;

        if (existsSync(metaPath)) {
          existingMeta = JSON.parse(await readFile(metaPath, 'utf-8'));
          existingDefaultRoute = existingMeta.defaultRoute;
        }

        const jsonFiles = await glob('**/*.json', { 
          cwd: sectionPath,
          ignore: '**/_meta.json'
        });

        // Create nested meta structure using existing defaultRoute if available
        const meta = {
          defaultRoute: existingDefaultRoute || (section === 'docs' ? '/docs/introduction' : '/articles/welcome')
        };
        
        for (const jsonFile of jsonFiles) {
          const fileName = path.basename(jsonFile, '.json');
          const filePath = path.join(sectionPath, jsonFile);
          const content = JSON.parse(await readFile(filePath, 'utf-8'));
          const dirs = path.dirname(jsonFile).split('/').filter(d => d !== '.');
          
          // Convert file name to camelCase for the key
          const fileKey = fileName.replace(/-/g, ' ')
            .split(' ')
            .map((word, index) => {
              const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
              return index === 0 ? capitalized.toLowerCase() : capitalized;
            })
            .join('');

          // Create nested structure
          let current = meta;
          
          if (dirs.length > 0) {
            for (const dir of dirs) {
              const dirKey = dir.replace(/-/g, ' ')
                .split(' ')
                .map((word, index) => {
                  const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
                  return index === 0 ? capitalized.toLowerCase() : capitalized;
                })
                .join('');

              if (!current[dirKey]) {
                current[dirKey] = {
                  title: dir.split('_')
                    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(' '),
                  items: {}
                };
              }
              current = current[dirKey].items;
            }
          }

          // Check if there's an existing entry and preserve its title
          const existingEntry = findExistingEntry(existingMeta, dirs, fileKey);
          const title = existingEntry?.title || content.title || fileName.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          current[fileKey] = {
            title,
            path: `/${section}/${jsonFile.replace('.json', '')}`
          };
        }

        // Write meta file
        const metaDataPath = path.join(sectionPath, '_meta.json');
        await writeFile(metaDataPath, JSON.stringify(meta, null, 2));
        console.log(`Created meta file: ${metaDataPath}`);
      }
    }
  } catch (error) {
    console.error('Error creating meta files:', error);
    process.exit(1);
  }
}

// Helper function to find existing entry in nested meta structure
function findExistingEntry(meta, dirs, fileKey) {
  let current = meta;
  
  // Navigate through directories
  for (const dir of dirs) {
    const dirKey = dir.replace(/-/g, ' ')
      .split(' ')
      .map((word, index) => {
        const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
        return index === 0 ? capitalized.toLowerCase() : capitalized;
      })
      .join('');

    if (!current[dirKey] || !current[dirKey].items) return null;
    current = current[dirKey].items;
  }

  return current[fileKey];
}

async function main() {
  await compileMarkdownFiles();
  await createMetaFilesForAllFolders();
}

main();