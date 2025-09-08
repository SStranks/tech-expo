/* eslint-disable perfectionist/sort-objects */
import esbuild from 'esbuild';
import { copy } from 'esbuild-plugin-copy';
import { replaceTscAliasPaths } from 'tsc-alias';

import path from 'node:path';
import url from 'node:url';

const CWD = path.dirname(url.fileURLToPath(import.meta.url));

await esbuild.build({
  bundle: false,
  entryPoints: ['./src/**/*.ts'],
  outdir: path.resolve(CWD, './dist'),
  platform: 'node',
  target: 'node18',
  format: 'esm',
  tsconfig: path.resolve(CWD, './tsconfig.json'),
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
  configFile: path.resolve(CWD, './tsconfig.json'),
  watch: false,
  outDir: path.resolve(CWD, './dist'),
  declarationDir: path.resolve(CWD, './dist'),
});
