const fs = require('fs/promises');
const path = require('path');
const { glob } = require('glob');
const sqlite3 = require('better-sqlite3');

class EmbeddingPipeline {
  static task = 'feature-extraction';
  static model = 'sauravpanda/gte-small-onnx';
  static instance = null;

  static async getInstance(progress_callback = null) {
    if (this.instance === null) {
      // Optionally set cache directory
      const { pipeline, env } = await import('@xenova/transformers');
      this.instance = await pipeline(this.task, this.model, { progress_callback });
    }
    return this.instance;
  }
}

async function generateEmbedding(text) {
  try {
    const extractor = await EmbeddingPipeline.getInstance();
    const output = await extractor(text, { pooling: 'mean', normalize: true });
    return Array.from(output.data);
  } catch (error) {
    console.error('Error generating embedding:', error);
    return null;
  }
}

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
    
    const dbPath = path.join(contextDir, 'docs.db');
    const db = sqlite3(dbPath);
    
    db.exec(`
      CREATE TABLE IF NOT EXISTS documents (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        path TEXT NOT NULL,
        content TEXT NOT NULL,
        embedding BLOB,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      )
    `);
    
    // Initialize the embedding model once
    console.log('Initializing embedding model...');
    // const extractor = await pipeline('feature-extraction', 'sauravpanda/gte-small-onnx');
    
    const enDocsDir = path.join(process.cwd(), 'compiled', 'en');
    const docFiles = await glob('**/*.json', { 
      cwd: enDocsDir,
      ignore: '**/_meta.json'
    });
    
    db.prepare('DELETE FROM documents').run();
    const insert = db.prepare('INSERT INTO documents (path, content, embedding) VALUES (?, ?, ?)');
    
    console.log('Processing documents and generating embeddings...');
    
    for (const file of docFiles) {
      const fullPath = path.join(enDocsDir, file);
      const content = await processDocFile(fullPath);
      if (content) {
        const embedding = await generateEmbedding(content);
        insert.run(file, content, embedding ? JSON.stringify(embedding) : null);
        console.log(`Processed: ${file}`);
      }
    }
    
    db.exec(`CREATE INDEX IF NOT EXISTS idx_embedding ON documents(embedding)`);
    console.log('Documentation context and embeddings have been stored in SQLite database!');
    db.close();
  } catch (error) {
    console.error('Error processing documentation:', error);
    process.exit(1);
  }
}

if (require.main === module) {
  main().catch(console.error);
}

module.exports = { main };