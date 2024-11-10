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
  
  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
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

  // Load existing meta file if it exists
  if (existsSync(metaPath)) {
    const content = await readFile(metaPath, 'utf-8');
    meta = JSON.parse(content);
  }

  // Get the file name without extension
  const fileName = path.basename(newFile, '.json');
  
  // Read the compiled file to get its title
  const compiledContent = JSON.parse(await readFile(newFile, 'utf-8'));
  const title = compiledContent.title || fileName;
  
  // Get the relative path without the 'compiled' prefix and '.json' extension
  const relativePath = path.dirname(newFile)
    .split('compiled/')[1]
    .replace(/^\//, '');
    
  // Add or update the entry
  meta[fileName] = {
    title: title,
    path: `/${relativePath}/${fileName}`
  };

  // Write updated meta file
  await writeFile(metaPath, JSON.stringify(meta, null, 2));
}

async function compileMarkdownFiles() {
  try {
    const files = await glob('_contents/**/*.md', { cwd: process.cwd() });
    
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

      const compiledPath = file
        .replace('_contents/', 'compiled/')
        .replace('.md', '.json');
      
      await mkdir(path.dirname(compiledPath), { recursive: true });
      await writeFile(compiledPath, JSON.stringify(compiledContent, null, 2));
      
      // Update _meta.json in the compiled folder
      await updateMetaFile(path.dirname(compiledPath), compiledPath);
      
      console.log(`Compiled ${file} -> ${compiledPath}`);
    }
  } catch (error) {
    console.error('Error compiling markdown files:', error);
    process.exit(1);
  }
}

compileMarkdownFiles();