import { getAkiradocsConfig } from "./getAkiradocsConfig";
const config = getAkiradocsConfig();
declare var require: {
  context(
    directory: string,
    useSubdirectories: boolean,
    regExp: RegExp
  ): any;
};
const contentContext = require.context(
    `../../compiled/`, 
    true, // Include subdirectories
    /^\.\/.*\.json$/ // Update this regex to be more specific
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
