import BrotliPlugin from 'brotli-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';

import path from 'node:path';

import { merge } from 'webpack-merge';
import CommonConfig from './webpack.common.js';

const CWD = process.env.INIT_CWD;

const ProdConfig = {
  mode: 'production',
  // entry: {
  //   app: './src/index.tsx',
  //   script: './src/script.ts',
  //   serviceWorker: {
  //     import: './src/serviceWorker.ts',
  //     filename: 'serviceWorker.js',
  //   },
  // },
  output: {
    path: path.resolve(CWD, 'dist'),
    filename: 'main.[contenthash].js',
    assetModuleFilename: 'assets/[ext]/[name].[hash][ext]',
    clean: true,
  },
  module: {
    rules: [
      {
        test: /\.module\.scss$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              url: {
                filter: (assetUrl) => {
                  if (assetUrl.startsWith('/public')) return false;
                  return true;
                },
              },
              modules: { localIdentName: '[local]-[hash:base64:5]' },
              importLoaders: 2, // => post-css and sass
            },
          },
          {
            loader: 'postcss-loader',
            options: {
              postcssOptions: {
                plugins: ['autoprefixer'],
              },
            },
          },
          'sass-loader',
        ],
      },
      {
        test: /\.scss$/,
        exclude: /\.module.scss$/,
        use: [MiniCssExtractPlugin.loader, 'css-loader', 'sass-loader'],
      },
    ],
  },
  optimization: {
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: [/favicon/i, /image-hero/i],
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: ['imagemin-gifsicle', 'imagemin-mozjpeg', 'imagemin-pngquant', 'imagemin-svgo'],
          },
        },
        generator: [
          {
            type: 'asset',
            implementation: ImageMinimizerPlugin.imageminGenerate,
            options: {
              plugins: ['imagemin-webp'],
            },
          },
        ],
      }),
    ],
  },
  plugins: [
    new MiniCssExtractPlugin({
      filename: '[name].[contenthash].css',
    }),
    new HTMLWebpackPlugin({
      template: path.resolve(CWD, './src/index-template.html.ejs'),
      favicon: path.resolve(CWD, './src/favicon-32x32.png'),
      templateParameters: {
        PUBLIC_URL: process.env.PUBLIC_URL,
      },
      minify: {
        removeAttributeQuotes: true,
        collapseWhitespace: true,
        removeComments: true,
      },
    }),
    new CompressionPlugin({
      filename: '[path][base].gz',
      algorithm: 'gzip',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.7,
    }),
    new BrotliPlugin({
      asset: '[path].br[query]',
      test: /\.js$|\.css$|\.html$/,
      threshold: 10240,
      minRatio: 0.7,
    }),
    new CopyPlugin({
      patterns: [
        {
          from: path.resolve(CWD, 'public'),
          to: path.resolve(CWD, 'dist/public'),
          globOptions: { ignore: ['**/img/**'] },
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(CWD, 'public/img'),
          to: path.resolve(CWD, 'dist/img/[path][name].[contenthash][ext]'),
          noErrorOnMissing: true,
        },
        { from: path.resolve(CWD, 'public/robots.txt'), noErrorOnMissing: true },
        { from: path.resolve(CWD, 'public/sitemap.xml'), noErrorOnMissing: true },
      ],
    }),
    new Dotenv({ path: path.resolve(CWD, './.env.prod') }),
  ],
};

export default merge(CommonConfig, ProdConfig);
