import { mkdir, readdir, copyFile } from 'fs/promises';
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
];

export async function copyDir(src: string, dest: string) {
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