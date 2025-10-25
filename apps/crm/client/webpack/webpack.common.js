/* eslint-disable perfectionist/sort-objects */
// @ts-check
import ESLintPlugin from 'eslint-webpack-plugin';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

/** @type { import('webpack').Configuration } */
const CommonConfig = {
  entry: path.resolve(__dirname, '../src/index.tsx'),
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'],

    /*
     * For use in CSS url() imports e.g url(~svg/desktop/a.svg)
     * Prefix with ~ to initiate module resolver
     */
    modules: ['node_modules', path.resolve(__dirname, './src/assets')],
    alias: {
      '@Shared': path.resolve(__dirname, '../../shared'),
      '@Img': path.resolve(__dirname, '../src/assets/img'),
      '@Sass': path.resolve(__dirname, '../src/assets/sass'),
      '@Svg': path.resolve(__dirname, '../src/assets/svg'),
      '@Components': path.resolve(__dirname, '../src/components'),
      '@Config': path.resolve(__dirname, '../src/config'),
      '@Context': path.resolve(__dirname, '../src/context'),
      '@Data': path.resolve(__dirname, '../src/data'),
      '@Features': path.resolve(__dirname, '../src/features'),
      '@Graphql': path.resolve(__dirname, '../src/graphql'),
      '@Hooks': path.resolve(__dirname, '../src/hooks'),
      '@Layouts': path.resolve(__dirname, '../src/layouts'),
      '@Lib': path.resolve(__dirname, '../src/lib'),
      '@Modules': path.resolve(__dirname, '../src/modules'),
      '@Pages': path.resolve(__dirname, '../src/pages'),
      '@Redux': path.resolve(__dirname, '../src/redux'),
      '@Routes': path.resolve(__dirname, '../src/routes'),
      '@Services': path.resolve(__dirname, '../src/services'),
      '@Stories': path.resolve(__dirname, '../src/stories'),
      '@Types': path.resolve(__dirname, '../src/types'),
      '@Utils': path.resolve(__dirname, '../src/utils'),
    },
  },
  module: {
    rules: [
      {
        test: /\.html$/,
        use: 'html-loader',
      },
      {
        test: /\.(png|svg|jpg|jpeg|gif|avif)$/i,
        type: 'asset/resource',
      },
      {
        test: /\.m?js/,
        resolve: {
          fullySpecified: false,
        },
      },
    ],
  },
  plugins: [
    new ESLintPlugin({
      configType: 'flat',
      failOnError: false,
      failOnWarning: false,
      emitError: true,
      emitWarning: true,
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
  ],
};

export default CommonConfig;
