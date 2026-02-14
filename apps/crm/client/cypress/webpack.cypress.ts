/* eslint-disable perfectionist/sort-objects */
import 'webpack-dev-server';
import type { Configuration } from 'webpack';

import path from 'node:path';
import url from 'node:url';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const config = {
  mode: 'development',
  entry: path.resolve(__dirname, '../src/index.tsx'),
  target: 'web',
  devtool: 'inline-source-map',
  devServer: {
    port: 3005,
    static: [
      {
        directory: path.resolve(__dirname, '../public'),
        staticOptions: {
          extensions: ['jpeg', 'png'],
        },
      },
    ],
    historyApiFallback: true,
    open: false,
    hot: true,
    liveReload: true,
  },
  stats: {
    loggingDebug: ['sass-loader'],
    errorDetails: true,
  },
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    // For use in CSS url() imports e.g url(~svg/desktop/a.svg)
    // Prefix with ~ to initiate module resolver
    modules: ['node_modules', path.resolve(__dirname, '../src/assets')],
    alias: {
      '@Shared': path.resolve(__dirname, '../../shared'),
      '@Img': path.resolve(__dirname, '../src/assets/img'),
      '@Sass': path.resolve(__dirname, '../src/assets/sass'),
      '@Svg': path.resolve(__dirname, '../src/assets/svg'),
      '@Components': path.resolve(__dirname, '../src/components'),
      '@Context': path.resolve(__dirname, '../src/context'),
      '@Data': path.resolve(__dirname, '../src/data'),
      '@Features': path.resolve(__dirname, '../src/features'),
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
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
            options: {
              rootMode: 'upward',
            },
          },
          {
            loader: 'ts-loader',
            options: {
              onlyCompileBundledFiles: true,
              compilerOptions: {
                noEmit: false,
              },
            },
          },
        ],
      },
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
      {
        test: /\.module\.scss$/,
        use: [
          'style-loader',
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:5]',
                namedExport: false,
                exportLocalsConvention: 'asIs',
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module.scss$/,
        use: ['style-loader', 'css-loader', 'sass-loader'],
      },
    ],
  },
} satisfies Configuration;

export default config;
