const { readFile, writeFile, mkdir } = require('fs/promises');
const { glob } = require('glob');
const matter = require('gray-matter');
const path = require('path');
const yargs = require('yargs/yargs');
const { hideBin } = require('yargs/helpers');

function processGitbookContent(content) {
  // Remove Gitbook-specific content references
  content = content.replace(/{% content-ref url="(.*?)" %}[\s\S]*?{% endcontent-ref %}/g, '');
  
  // Convert Gitbook links to standard markdown links
  content = content.replace(/\[(.*?)\]\((.*?)\.md\)/g, (match, text, url) => {
    // Remove .md extension and convert to relative path
    const cleanUrl = url.replace(/\.md$/, '');
    return `[${text}](${cleanUrl})`;
  });

  return content;
}

async function migrateGitbookContent(options) {
  const {
    inputDir,
    outputDir = '_contents',
    language = 'en',
    defaultAuthor = 'Anonymous'
  } = options;

  try {
    const files = await glob(`${inputDir}/**/*.md`, { cwd: process.cwd() });
    
    if (files.length === 0) {
      console.warn(`No markdown files found in ${inputDir}`);
      return;
    }

    console.log(`Found ${files.length} files to migrate...`);
    
    for (const file of files) {
      const content = await readFile(file, 'utf-8');
      const { data: frontmatter, content: markdownContent } = matter(content);
      
      const processedContent = processGitbookContent(markdownContent);
      
      const newFrontmatter = {
        title: frontmatter.title || '',
        description: frontmatter.description || '',
        author: frontmatter.author || defaultAuthor,
        publishDate: frontmatter.publishDate || new Date().toISOString().split('T')[0],
        modifiedDate: frontmatter.modifiedDate || new Date().toISOString().split('T')[0],
        category: frontmatter.category || '',
        keywords: frontmatter.keywords || []
      };

      const newContent = matter.stringify(processedContent, newFrontmatter);
      
      const newPath = file
        .replace(new RegExp(`^${inputDir}`), path.join(outputDir, language, 'docs'))
        .replace(/SUMMARY\.md$/i, 'index.md');
      
      await mkdir(path.dirname(newPath), { recursive: true });
      await writeFile(newPath, newContent);
      
      console.log(`Migrated ${file} -> ${newPath}`);
    }
  } catch (error) {
    console.error('Error migrating Gitbook content:', error);
    process.exit(1);
  }
}

async function main() {
  const argv = yargs(hideBin(process.argv))
    .usage('Usage: $0 <input-dir> [options]')
    .positional('input-dir', {
      describe: 'Input directory containing Gitbook markdown files',
      type: 'string'
    })
    .option('output-dir', {
      alias: 'o',
      type: 'string',
      description: 'Output directory for processed files',
      default: '_contents'
    })
    .option('language', {
      alias: 'l',
      type: 'string',
      description: 'Language code for the content',
      default: 'en'
    })
    .option('author', {
      alias: 'a',
      type: 'string',
      description: 'Default author name for content without authors',
      default: 'Anonymous'
    })
    .demandCommand(1, 'Please specify an input directory')
    .help()
    .argv;

  // Clean up input directory path by removing trailing slashes
  const inputDir = argv._[0].replace(/\/+$/, '');
  
  if (!inputDir) {
    console.error('Input directory is required');
    process.exit(1);
  }

  await migrateGitbookContent({
    inputDir,
    outputDir: argv.outputDir,
    language: argv.language,
    defaultAuthor: argv.author
  });
}

module.exports = {
  main,
  migrateGitbookContent
};

if (require.main === module) {
  main();
}
