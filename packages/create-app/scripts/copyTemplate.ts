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
  '.million',
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
  templatePackageJson.version = current_version;
  await writeFile(
    templatePackageJsonPath,
    JSON.stringify(templatePackageJson, null, 2)
  );
}
