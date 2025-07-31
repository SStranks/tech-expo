/// <reference types="vitest/config" />
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

import path from 'node:path';

const CUR = './';

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {
        api: 'modern-compiler',
      },
    },
  },
  resolve: {
    alias: {
      '@Components': path.resolve(CUR, 'src/components'),
      '@Context': path.resolve(CUR, 'src/context'),
      '@Data': path.resolve(CUR, 'src/data'),
      '@Features': path.resolve(CUR, 'src/features'),
      '@Hooks': path.resolve(CUR, 'src/hooks'),
      '@Img': path.resolve(CUR, 'src/assets/img'),
      '@Layouts': path.resolve(CUR, 'src/layouts'),
      '@Lib': path.resolve(CUR, 'src/lib'),
      '@Modules': path.resolve(CUR, 'src/modules'),
      '@Pages': path.resolve(CUR, 'src/pages'),
      '@Redux': path.resolve(CUR, 'src/redux'),
      '@Routes': path.resolve(CUR, 'src/routes'),
      '@Sass': path.resolve(CUR, 'src/assets/sass'),
      '@Services': path.resolve(CUR, 'src/services'),
      '@Shared': path.resolve(CUR, '../shared'),
      '@Stories': path.resolve(CUR, 'src/stories'),
      '@Svg': path.resolve(CUR, 'src/assets/svg'),
      '@Types': path.resolve(CUR, 'src/types'),
      '@Utils': path.resolve(CUR, 'src/utils'),
    },
  },
  test: {
    env: loadEnv('dev', process.cwd(), ''),
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    setupFiles: ['./vitest.setup.ts'],
    exclude: [
      '**/node_modules/**',
      '**/dist/**',
      '**/cypress/**',
      '**/__snapshots__/**',
      '**/.sassdoc/**',
      '**/.storybook/**',
      '**/private/**',
      '**/public/**',
      '**/webpack/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
  },
});
