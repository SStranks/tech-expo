import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import viteReactPlugin from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { loadEnv } from 'vite';
import viteTsconfigPathsPlugin from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig({
  plugins: [viteTsconfigPathsPlugin(), viteReactPlugin()],
  css: {
    preprocessorOptions: {
      scss: {},
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
      '**/private*',
      '**/public/**',
      '**/webpack/**',
      '**/.{idea,git,cache,output,temp}/**',
      '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
    ],
    projects: [
      {
        extends: true,
        test: {
          name: 'unit',
        },
      },
      {
        plugins: [
          storybookTest({
            configDir: path.join(__dirname, '.storybook'),
            storybookScript: 'pnpm run storybook',
          }),
          viteReactPlugin(),
        ],
        test: {
          name: 'storybook',
          setupFiles: ['./.storybook/vitest.setup.ts'],
          browser: {
            enabled: true,
            headless: true,
            instances: [{ browser: 'chromium' }],
            provider: playwright({}),
          },
        },
      },
    ],
  },
});
