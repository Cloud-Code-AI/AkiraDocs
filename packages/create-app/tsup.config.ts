import { defineConfig } from 'tsup';
import { chmod } from 'fs/promises';
import { copyDir, updatePackageJsonVersion } from './scripts/copyTemplate';
import { readFile } from 'fs/promises';
import path from 'path';

export default defineConfig({
  entry: ['src/index.ts'],
  format: ['esm'],
  dts: true,
  splitting: false,
  sourcemap: true,
  clean: true,
  target: 'node16',
  platform: 'node',
  noExternal: ['cac', 'chalk', 'prompts', 'ora'],
  banner: {
    js: '#!/usr/bin/env node',
  },
  async onSuccess() {
    // Copy main template
    await copyDir('../akiradocs', './template');

    // Copy main README and gifs folder
    const rootDir = path.resolve(__dirname, '../..');
    const mainReadmePath = path.join(rootDir, 'README.md');
    const gifsFolder = path.join(rootDir, 'gifs');
    
    // Copy main README to template
    await copyDir(mainReadmePath, path.join('./template', 'README.md'));
    await copyDir(mainReadmePath, path.join('./template', '.gitignore'));
    
    // Copy gifs folder to template
    await copyDir(gifsFolder, path.join('./template', 'gifs'));

    // Update package.json version
    const templatePackageJson = JSON.parse(
      await readFile('./package.json', 'utf-8')
    );
    await updatePackageJsonVersion('./template', templatePackageJson.version);
    await chmod('dist/index.js', 0o755);
  },
});
