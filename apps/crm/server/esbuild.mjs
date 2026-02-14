/* eslint-disable perfectionist/sort-objects */
import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { replaceTscAliasPaths } from 'tsc-alias';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

await esbuild.build({
  bundle: true,
  splitting: true,
  entryPoints: ['./src/main.ts'],
  outdir: path.resolve(__dirname, './dist'),
  platform: 'node',
  target: 'node18',
  format: 'esm',
  tsconfig: path.resolve(__dirname, './tsconfig.src.json'),
  external: ['bcrypt', 'argon2', 'sharp', 'pino-mongodb', 'postgres'],
  plugins: [
    copy({
      assets: [
        {
          from: ['./src/**/*.{graphql,html}'],
          to: ['./'],
        },
      ],
    }),
  ],
});

// BUG: check tsconfig; disabled base-url replacer; naming collision if package name equals alias target e.g. 'graphql'
await replaceTscAliasPaths({
  configFile: path.resolve(__dirname, './tsconfig.json'),
  watch: false,
  outDir: path.resolve(__dirname, './dist'),
  declarationDir: path.resolve(__dirname, './dist'),
});
