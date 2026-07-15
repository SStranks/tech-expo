import { storybookTest } from '@storybook/addon-vitest/vitest-plugin';
import { tanstackRouter } from '@tanstack/router-plugin/vite';
import viteReactPlugin from '@vitejs/plugin-react';
import { playwright } from '@vitest/browser-playwright';
import { loadEnv } from 'vite';
import viteTsconfigPathsPlugin from 'vite-tsconfig-paths';
import { defineConfig } from 'vitest/config';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  return {
    css: {
      preprocessorOptions: {
        scss: {},
      },
    },
    plugins: [
      viteTsconfigPathsPlugin({ root: path.resolve(__dirname) }),
      viteReactPlugin(),
      tanstackRouter({ generatedRouteTree: './src/routeTree.gen.ts', routesDirectory: './src/routes' }),
    ],
    test: {
      coverage: {
        include: ['src/**.{js,jsx,ts,tsx}'],
      },
      env: loadEnv(`${mode}.client`, process.cwd(), ''),
      environment: 'jsdom',
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
      globals: true,
      include: ['src/**/*.{test,spec}.?(c|m)[jt]s?(x)'],
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
            browser: {
              enabled: true,
              headless: true,
              instances: [{ browser: 'chromium' }],
              provider: playwright({}),
            },
            name: 'storybook',
          },
        },
      ],
      setupFiles: ['./vitest.setup.ts'],
      resolveSnapshotPath: (testPath, _snapshotExtension) => {
        return testPath.replace(/src/, '__snapshots__');
      },
    },
  };
});
