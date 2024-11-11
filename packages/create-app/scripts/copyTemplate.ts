import {
  mkdir,
  readdir,
  copyFile,
  readFile,
  writeFile,
  stat,
} from 'fs/promises';
import path from 'path';

const ignoredPaths = [
  'node_modules',
  '.next',
  'dist',
  '.git',
  '.env',
  '.env.local',
  '.DS_Store',
  '.turbo',
  '.vercel',
  '.turbo',
];

export async function copyDir(src: string, dest: string) {
  const stats = await stat(src);
  if (!stats.isDirectory()) {
    // Skip if it's a socket file
    if (stats.isSocket()) {
      return;
    }
    await copyFile(src, dest);
    return;
  }
  await mkdir(dest, { recursive: true });
  const entries = await readdir(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    // Skip ignored paths
    if (ignoredPaths.includes(entry.name)) {
      continue;
    }

    if (entry.isDirectory()) {
      await copyDir(srcPath, destPath);
    } else {
      if (entry.name === 'package.json') {
        // Read the current package.json to get its version
        const currentPackageJson = JSON.parse(
          await readFile(path.join(process.cwd(), 'package.json'), 'utf-8')
        );

        // Read the template package.json
        const templatePackageJson = JSON.parse(
          await readFile(srcPath, 'utf-8')
        );

        // Update the version
        templatePackageJson.version = currentPackageJson.version;

        // Write the updated package.json to destination
        await writeFile(destPath, JSON.stringify(templatePackageJson, null, 2));
      } else {
        await copyFile(srcPath, destPath);
      }
    }
  }
}
