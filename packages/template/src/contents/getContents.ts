// Use require.context to get all files in the _contents folder
declare let require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): any;
};

const contentContext = require.context(
    '../../_contents', // Assuming _contents is in the parent directory
    true, // Include subdirectories
    /^\.\/(markdown|json)\/(?:articles|docs)\/.*\.(json|md)$/ // Only include .json and .md files from articles and docs folders
);
  
export function fetchAllContent() {
  const content: { [key: string]: any } = {};
  
  contentContext.keys().forEach((key: string) => {
    const fileName = key.replace(/^\.\//, '');
    const fileContent = contentContext(key);
    content[fileName] = fileContent;
  });
  
  return content;
}
