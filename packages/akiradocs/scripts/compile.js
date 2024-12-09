const { readFile, writeFile, mkdir, readdir } = require('fs/promises');
const { glob } = require('glob');
const matter = require('gray-matter');
const path = require('path');
const { existsSync } = require('fs');
const { main: extractDocsContext } = require('./extract-docs-context');

async function convertMarkdownToBlocks(content) {
  const blocks = [];
  let currentBlock = [];
  let blockId = 1;
  let skipNextLine = false;
  let firstHeadingFound = false;
  let title = '';

  const lines = content.split('\n');
  
  let listItems = [];

  for (let i = 0; i < lines.length; i++) {
    const line = lines[i];
    
    if (skipNextLine) {
      skipNextLine = false;
      continue;
    }

    if (line.trim().startsWith('-')) {
      if (currentBlock.length > 0) {
        blocks.push({
          id: String(blockId++),
          type: 'paragraph',
          content: currentBlock.join('\n').trim()
        });
        currentBlock = [];
      }
      
      const processedLine = line.trim().substring(1).trim().replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      listItems.push(processedLine);
      
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

    if (line.trim() === '***') {
      if (currentBlock.length > 0) {
        blocks.push({
          id: String(blockId++),
          type: 'paragraph',
          content: currentBlock.join('\n').trim()
        });
        currentBlock = [];
      }

      blocks.push({
        id: String(blockId++),
        type: 'divider',
        content: ''
      });
      continue;
    }

    if (line.startsWith('#')) {
      if (!firstHeadingFound) {
        const match = line.match(/^#+\s*(.*)/);
        if (match) {
          title = match[1].trim();
          if (title.includes('**')) {
            title = `<strong>${title.replace(/\*\*/g, '')}</strong>`;
          }
          firstHeadingFound = true;
          skipNextLine = true;
          continue;
        }
      }

      if (currentBlock.length > 0) {
        blocks.push({
          id: String(blockId++),
          type: 'paragraph',
          content: currentBlock.join('\n').trim()
        });
        currentBlock = [];
      }

      const match = line.match(/^#+/);
      if (!match) continue;
      
      const level = match[0].length;
      let content = line.slice(level).trim();
      
      if (content.includes('**')) {
        content = `<strong>${content.replace(/\*\*/g, '')}</strong>`;
      }

      blocks.push({
        id: String(blockId++),
        type: 'heading',
        content: content,
        metadata: { level }
      });

      if (level === 1) {
        skipNextLine = true;
      }
      continue;
    }

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

        while (i < lines.length && lines[i].trim().startsWith('>')) {
          calloutContent.push(lines[i].trim().replace(/^>\s?/, ''));
          i++;
        }
        i--;

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

    if (line.trim()) {
      const processedLine = line.replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      currentBlock.push(processedLine);
    } else if (currentBlock.length > 0) {
      blocks.push({
        id: String(blockId++),
        type: 'paragraph',
        content: currentBlock.join('\n').trim()
      });
      currentBlock = [];
    }
  }

  if (currentBlock.length > 0 && currentBlock.some(line => line.trim())) {
    blocks.push({
      id: String(blockId++),
      type: 'paragraph',
      content: currentBlock.join('\n').trim()
    });
  }

  return { title, blocks };
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
  
  const relativePath = path.relative(
    path.join(process.cwd(), 'compiled'),
    folderPath
  );
  
  if (!meta[fileName]) {
    const humanReadableFileName = fileName
      .split('_')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
    
    const pathWithoutLang = relativePath.split(path.sep).slice(1).join(path.sep);
    meta[fileName] = {
      title: compiledContent.title || humanReadableFileName,
      path: path.join('/', pathWithoutLang, fileName)
    };
  } else {
    const pathWithoutLang = relativePath.split(path.sep).slice(1).join(path.sep);
    meta[fileName].path = path.join('/', pathWithoutLang, fileName);
  }

  await writeFile(metaPath, JSON.stringify(meta, null, 2));
}

async function compileMarkdownFiles() {
  try {
    const files = await glob(path.join('_contents', '**', '*.md'), { cwd: process.cwd() });
    
    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      const { data: frontmatter, content: markdownContent } = matter(content);
      
      const { title, blocks } = await convertMarkdownToBlocks(markdownContent);
      
      const compiledContent = {
        title: frontmatter.title || title || '',
        description: frontmatter.description || '',
        author: frontmatter.author || 'Anonymous',
        publishDate: frontmatter.publishDate || new Date().toISOString().split('T')[0],
        modifiedDate: frontmatter.modifiedDate || new Date().toISOString().split('T')[0],
        category: frontmatter.category || '',
        keywords: frontmatter.keywords || [],
        blocks
      };

      const compiledPath = file
        .replace(path.join('_contents'), path.join('compiled'))
        .replace('.md', '.json');
      
      await mkdir(path.dirname(compiledPath), { recursive: true });
      await writeFile(compiledPath, JSON.stringify(compiledContent, null, 2));
      
      // await updateMetaFile(path.dirname(compiledPath), compiledPath);
      
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

        let existingMeta = {};
        const metaPath = path.join(sectionPath, '_meta.json');
        let existingDefaultRoute;

        if (existsSync(metaPath)) {
          existingMeta = JSON.parse(await readFile(metaPath, 'utf-8'));
          existingDefaultRoute = existingMeta.defaultRoute;
        }

        const jsonFiles = await glob('**/*.json', { 
          cwd: sectionPath,
          ignore: ['**/_meta.json']
        });

        const meta = {
          defaultRoute: existingDefaultRoute || (section === 'docs' ? '/docs/introduction' : '/articles/welcome')
        };
        
        for (const jsonFile of jsonFiles) {
          const fileName = path.basename(jsonFile, '.json');
          const filePath = path.join(sectionPath, jsonFile);
          const content = JSON.parse(await readFile(filePath, 'utf-8'));
          const dirs = path.dirname(jsonFile).split(path.sep).filter(d => d !== '.');
          
          const fileKey = fileName.replace(/-/g, ' ')
            .split(' ')
            .map((word, index) => {
              const capitalized = word.charAt(0).toUpperCase() + word.slice(1);
              return index === 0 ? capitalized.toLowerCase() : capitalized;
            })
            .join('');

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

          const existingEntry = findExistingEntry(existingMeta, dirs, fileKey);
          const title = existingEntry?.title || content.title || fileName.split('_')
            .map(word => word.charAt(0).toUpperCase() + word.slice(1))
            .join(' ');

          current[fileKey] = {
            title,
            path: `/${section}/${jsonFile.replace('.json', '')}`
          };
        }

        await writeFile(metaPath, JSON.stringify(meta, null, 2));
        console.log(`Created/Updated meta file: ${metaPath}`);
      }
    }
  } catch (error) {
    console.error('Error creating meta files:', error);
    process.exit(1);
  }
}

function findExistingEntry(meta, dirs, fileKey) {
  let current = meta;
  
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
  await extractDocsContext();
}

main();