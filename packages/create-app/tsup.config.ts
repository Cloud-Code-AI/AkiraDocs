import { defineConfig } from 'tsup';
import { chmod } from 'fs/promises';
import { copyDir, updatePackageJsonVersion } from './scripts/copyTemplate';
import path from 'path';
import { readFile } from 'fs/promises';
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
    // Copy template before making the dist executable

    await copyDir('../akiradocs', './template');
    const templatePackageJson = JSON.parse(
      await readFile('./package.json', 'utf-8')
    );
    await updatePackageJsonVersion('./template', templatePackageJson.version);
    await chmod('dist/index.js', 0o755);
  },
});
