const fs = require('fs/promises');
const path = require('path');
const { glob } = require('glob');

async function extractTextFromBlocks(blocks) {
  if (!Array.isArray(blocks)) {
    return '';
  }

  return blocks
    .map(block => {
      if (!block || !block.type) return '';
      
      switch (block.type) {
        case 'heading':
          return block.content;
        case 'paragraph':
          return block.content ? block.content : '';
        case 'list':
          if (Array.isArray(block.content)) {
            return block.content.join('\n');
          }
          return block.content || '';
        case 'code':
          return `Code example:\n${block.content}`;
        case 'callout':
          return `${block.metadata?.title || 'Note'}: ${block.content}`;
        default:
          return '';
      }
    })
    .filter(text => text.trim() !== '')
    .join('\n');
}

async function processDocFile(filePath) {
  try {
    const content = await fs.readFile(filePath, 'utf-8');
    const doc = JSON.parse(content);
    
    let extractedContent = [];
    
    if (doc.title) {
      extractedContent.push(`Title: ${doc.title}`);
    }
    
    if (doc.description) {
      extractedContent.push(doc.description);
    }
    
    if (doc.blocks) {
      const blockContent = await extractTextFromBlocks(doc.blocks);
      if (blockContent) {
        extractedContent.push(blockContent);
      }
    }
    
    return extractedContent.filter(text => text.trim() !== '').join('\n');
  } catch (error) {
    console.error(`Error processing file ${filePath}:`, error);
    return '';
  }
}

async function main() {
  try {
    const contextDir = path.join(process.cwd(), 'public', 'context');
    await fs.mkdir(contextDir, { recursive: true });
    
    const enDocsDir = path.join(process.cwd(), 'compiled', 'en');
    const docFiles = await glob('**/*.json', { 
      cwd: enDocsDir,
      ignore: '**/_meta.json'
    });
    
    let combinedContent = [];
    
    for (const file of docFiles) {
      const fullPath = path.join(enDocsDir, file);
      const content = await processDocFile(fullPath);
      if (content) {
        combinedContent.push(`[Document: ${file}]\n${content}\n-------------`);
      }
    }
    
    const outputPath = path.join(contextDir, 'en_docs.txt');
    await fs.writeFile(outputPath, combinedContent.join('\n'));
    
    console.log('Documentation context has been extracted successfully!');
  } catch (error) {
    console.error('Error processing documentation:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };