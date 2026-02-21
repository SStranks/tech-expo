import { loadEnv } from 'vite';
import { defineConfig } from 'vitest/config';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

export default defineConfig(({ mode }) => {
  return {
    resolve: {
      alias: {
        '#App': path.resolve(__dirname, 'src/app'),
        '#Config': path.resolve(__dirname, 'src/config'),
        '#Controllers': path.resolve(__dirname, 'src/controllers'),
        '#Data': path.resolve(__dirname, 'src/data'),
        '#Graphql': path.resolve(__dirname, 'src/graphql'),
        '#Helpers': path.resolve(__dirname, 'src/helpers'),
        '#Lib': path.resolve(__dirname, 'src/lib'),
        '#Log': path.resolve(__dirname, 'src/log'),
        '#Mappers': path.resolve(__dirname, 'src/mappers'),
        '#Middleware': path.resolve(__dirname, 'src/middleware'),
        '#Models': path.resolve(__dirname, 'src/models'),
        '#Routes': path.resolve(__dirname, 'src/routes'),
        '#Services': path.resolve(__dirname, 'src/services'),
        '#Tests': path.resolve(__dirname, 'src/tests'),
        '#Types': path.resolve(__dirname, 'src/types'),
        '#Utils': path.resolve(__dirname, 'src/utils'),
        '#Views': path.resolve(__dirname, 'src/views'),
      },
    },
    test: {
      env: loadEnv(`${mode}.server`, process.cwd(), ''),
      environment: 'node',
      globals: true,
      include: ['src/**/*.{test,spec}.?(c|m)[jt]s'],
      setupFiles: ['./vitest.setup.ts'],
      coverage: {
        include: ['src/**.{js,ts}'],
      },
      exclude: [
        '**/node_modules/**',
        '**/dist/**',
        '**/__snapshots__/**',
        '**/private/**',
        '**/private*',
        '**/public/**',
        '**/.{idea,git,cache,output,temp}/**',
        '**/{karma,rollup,webpack,vite,vitest,jest,ava,babel,nyc,cypress,tsup,build}.config.*',
      ],
    },
  };
});
