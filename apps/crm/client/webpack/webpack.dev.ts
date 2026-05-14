/* eslint-disable perfectionist/sort-objects */
import type { Configuration } from 'webpack';

import type { WebpackEnv } from './webpack.common';

import 'webpack-dev-server';

import ReactRefreshWebpackPlugin from '@pmmmwh/react-refresh-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import ForkTsCheckerWebpackPlugin from 'fork-ts-checker-webpack-plugin';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import SpeedMeasurePlugin from 'speed-measure-webpack-plugin';
import webpack from 'webpack';
import { merge } from 'webpack-merge';

import path from 'node:path';
import url from 'node:url';

import CommonConfig, { envKeys } from './webpack.common';

const __dirname = path.dirname(url.fileURLToPath(import.meta.url));

const DevConfig = (_env: WebpackEnv) => {
  return {
    mode: 'development',
    output: {
      path: path.resolve(__dirname, '../dist'),
      pathinfo: false,
      filename: '[name].js',
      chunkFilename: '[name].chunk.js',
      publicPath: '/',
      devtoolModuleFilenameTemplate: 'file:///[absolute-resource-path]',
    },
    devtool: 'eval-cheap-module-source-map',
    devServer: {
      port: 3000,
      static: [
        {
          directory: path.resolve(__dirname, '../public'),
          staticOptions: {
            extensions: ['jpeg', 'png'],
          },
        },
      ],
      historyApiFallback: true,

      /*
       * NOTE:
       * Can't use 'false' - dev-sever uses windows powershell to open browser
       * Usage: manually open browser at localhost:port
       */
      open: false,
      hot: true,
      liveReload: true,
    },
    stats: {
      loggingDebug: ['sass-loader'],
      errorDetails: true,
      errorStack: true,
      warnings: true,
    },
    module: {
      rules: [
        {
          test: /\.(ts|tsx|js|jsx)$/,
          include: path.resolve(__dirname, '../src'),
          exclude: [/node_modules/],
          use: {
            loader: 'swc-loader',
            options: {
              jsc: {
                parser: {
                  syntax: 'typescript',
                  tsx: true,
                  dynamicImport: true,
                },
                transform: {
                  react: {
                    development: true,
                    runtime: 'automatic',
                    refresh: true,
                  },
                },
              },
              sourceMaps: true,
            },
          },
        },
        {
          test: /\.css$/,
          use: ['style-loader', 'css-loader'],
        },
        {
          test: /\.module\.scss$/,
          exclude: [/node_modules/],
          use: [
            'style-loader',
            {
              loader: 'css-loader',
              options: {
                modules: {
                  localIdentName: '[local]-[hash:base64:5]',
                  namedExport: false,
                  exportLocalsConvention: 'as-is',
                },
              },
            },
            {
              loader: 'sass-loader',
              options: {
                implementation: 'sass-embedded',
                api: 'modern-compiler',
              },
            },
          ],
        },
        {
          test: /\.scss$/,
          exclude: [/node_modules/, /\.module.scss$/],
          use: [
            'style-loader',
            'css-loader',
            { loader: 'sass-loader', options: { implementation: 'sass-embedded', api: 'modern-compiler' } },
          ],
        },
      ],
    },
    optimization: {
      splitChunks: {
        chunks: 'all',
      },
    },
    plugins: [
      new HTMLWebpackPlugin({
        template: path.resolve(__dirname, '../src/index-template.html.ejs'),
        favicon: path.resolve(__dirname, '../src/favicon.ico'),
        templateParameters: {
          PUBLIC_URL: envKeys['PUBLIC_URL'],
        },
      }),
      new ReactRefreshWebpackPlugin(),
      new ForkTsCheckerWebpackPlugin({
        async: true,
        typescript: {
          configFile: path.resolve(__dirname, '../tsconfig.src.json'),
          diagnosticOptions: {
            semantic: true,
            syntactic: true,
          },
        },
      }),
      new CopyPlugin({ patterns: [{ from: path.resolve(__dirname, '../public'), noErrorOnMissing: true }] }),
      new webpack.DefinePlugin(envKeys),
    ],
  } satisfies Configuration;
};

const smp = new SpeedMeasurePlugin();
const WebpackDevConfig = (env: WebpackEnv) => smp.wrap(merge<Configuration>(CommonConfig(env), DevConfig(env)));
export default WebpackDevConfig;
