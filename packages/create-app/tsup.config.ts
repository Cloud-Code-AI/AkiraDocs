import { defineConfig } from 'tsup';
import { chmod } from 'fs/promises';
import { copyDir } from './scripts/copyTemplate';

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
    await copyDir('../template', './template');
    await chmod('dist/index.js', 0o755);
  },
});
