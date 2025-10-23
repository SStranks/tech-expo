/// <reference types="vitest/config" />
import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  css: {
    preprocessorOptions: {
      scss: {},
    },
  },
  resolve: {
    alias: {
      '@Components': path.resolve(__dirname, 'src/components'),
      '@Context': path.resolve(__dirname, 'src/context'),
      '@Data': path.resolve(__dirname, 'src/data'),
      '@Features': path.resolve(__dirname, 'src/features'),
      '@Hooks': path.resolve(__dirname, 'src/hooks'),
      '@Img': path.resolve(__dirname, 'src/assets/img'),
      '@Layouts': path.resolve(__dirname, 'src/layouts'),
      '@Lib': path.resolve(__dirname, 'src/lib'),
      '@Modules': path.resolve(__dirname, 'src/modules'),
      '@Pages': path.resolve(__dirname, 'src/pages'),
      '@Redux': path.resolve(__dirname, 'src/redux'),
      '@Routes': path.resolve(__dirname, 'src/routes'),
      '@Sass': path.resolve(__dirname, 'src/assets/sass'),
      '@Services': path.resolve(__dirname, 'src/services'),
      '@Shared': path.resolve(__dirname, '../shared'),
      '@Stories': path.resolve(__dirname, 'src/stories'),
      '@Svg': path.resolve(__dirname, 'src/assets/svg'),
      '@Types': path.resolve(__dirname, 'src/types'),
      '@Utils': path.resolve(__dirname, 'src/utils'),
    },
  },
  test: {
    env: loadEnv('dev', process.cwd(), ''),
    environment: 'jsdom',
    globals: true,
    include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
    setupFiles: ['./vitest.setup.ts'],
    coverage: {
      include: ['src/**.{js,jsx,ts,tsx}'],
    },
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
