// Use require.context to get all files in the _contents folder
const contentContext = require.context(
    '../../_contents', // Assuming _contents is in the parent directory
    true, // Include subdirectories
    /^\.\/(?:articles|docs)\/.*\.json$/ // Only include .json files from articles and docs folders
);
  
export function fetchAllContent() {
  const content: { [key: string]: any } = {};
  
  contentContext.keys().forEach((key) => {
    const fileName = key.replace(/^\.\//, '');
    const fileContent = contentContext(key);
    content[fileName] = fileContent;
  });
  
  return content;
}
