import {
  mkdir,
  readdir,
  copyFile,
  readFile,
  writeFile,
  stat,
} from 'fs/promises';
import path from 'path';
import { exec } from 'child_process';
import { promisify } from 'util';

const execAsync = promisify(exec);

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
      await copyFile(srcPath, destPath);
    }
  }
}

export async function updatePackageJsonVersion(
  src: string,
  current_version: string
) {
  const templatePackageJsonPath = path.join(src, 'package.json');
  const templatePackageJson = JSON.parse(
    await readFile(templatePackageJsonPath, 'utf-8')
  );
  
  // Remove workspace dependencies
  if (templatePackageJson.devDependencies) {
    delete templatePackageJson.devDependencies['akiradocs-ui'];
    delete templatePackageJson.devDependencies['akiradocs-types'];
  }
  
  templatePackageJson.version = current_version;
  await writeFile(
    templatePackageJsonPath,
    JSON.stringify(templatePackageJson, null, 2)
  );

  // Run npm install in the template directory
  try {
    await execAsync('npm install akiradocs-ui@latest akiradocs-types@latest', { cwd: src });
  } catch (error) {
    console.error('Failed to run npm install:', error);
  }
}
