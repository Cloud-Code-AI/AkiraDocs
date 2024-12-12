const fs = require('fs');
const path = require('path');

function getAllFiles(dirPath, arrayOfFiles = []) {
  const files = fs.readdirSync(dirPath);

  files.forEach(file => {
    const fullPath = path.join(dirPath, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getAllFiles(fullPath, arrayOfFiles);
    } else {
      arrayOfFiles.push(
        fullPath.replace(path.join(process.cwd(), 'compiled/'), '')
      );
    }
  });

  return arrayOfFiles;
}

const manifest = {
  files: getAllFiles(path.join(process.cwd(), 'compiled'))
};

fs.writeFileSync(
  path.join(process.cwd(), 'compiled/manifest.json'),
  JSON.stringify(manifest, null, 2)
); 