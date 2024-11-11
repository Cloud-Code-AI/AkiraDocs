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
          content: listItems.join('\n'),
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
        content: listItems.join('\n'),
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

    // Handle callouts
    if (line.startsWith(':::')) {
      if (currentBlock.length > 0) {
        blocks.push({
          id: String(blockId++),
          type: 'paragraph',
          content: currentBlock.join('\n').trim()
        });
        currentBlock = [];
      }

      const calloutMatch = line.match(/^:::(\w+)\s*(.*)/);
      if (calloutMatch) {
        const [_, type, title] = calloutMatch;
        let calloutContent = [];
        i++;

        while (i < lines.length && !lines[i].startsWith(':::')) {
          calloutContent.push(lines[i]);
          i++;
        }

        blocks.push({
          id: String(blockId++),
          type: 'callout',
          content: calloutContent.join('\n').trim(),
          metadata: {
            type,
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
  const humanReadableFileName = fileName
    .split('_')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
  const title = compiledContent.title || humanReadableFileName;
  
  // Split the path using platform-specific separator and rejoin using path.join
  const pathParts = path.dirname(newFile).split(path.sep);
  const compiledIndex = pathParts.indexOf('compiled');
  const relativePath = pathParts
    .slice(compiledIndex + 2) // Skip 'compiled' and language code
    .join(path.sep);
    
  meta[fileName] = {
    title: title,
    path: path.join('/', relativePath, fileName)
  };

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

compileMarkdownFiles();