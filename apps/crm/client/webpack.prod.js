/* eslint-disable unicorn/numeric-separators-style */
import BrotliPlugin from 'brotli-webpack-plugin';
import CompressionPlugin from 'compression-webpack-plugin';
import CopyPlugin from 'copy-webpack-plugin';
import CssMinimizerPlugin from 'css-minimizer-webpack-plugin';
import Dotenv from 'dotenv-webpack';
import HTMLWebpackPlugin from 'html-webpack-plugin';
import ImageMinimizerPlugin from 'image-minimizer-webpack-plugin';
import MiniCssExtractPlugin from 'mini-css-extract-plugin';
import { WebpackManifestPlugin } from 'webpack-manifest-plugin';
import { merge } from 'webpack-merge';

import path from 'node:path';
import url from 'node:url';

import CommonConfig from './webpack.common.js';

const CUR = path.dirname(url.fileURLToPath(import.meta.url));

const ProdConfig = {
  mode: 'production',
  output: {
    path: path.resolve(CUR, 'dist'),
    filename: '[name].bundle.[contenthash].js',
    assetModuleFilename: 'assets/[ext]/[name].[hash][ext]',
    clean: true,
  },
  devtool: 'source-map',
  module: {
    rules: [
      {
        test: /\.(ts|tsx|js|jsx)$/,
        exclude: [/node_modules/],
        use: [
          {
            loader: 'babel-loader',
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
        test: /\.css$/,
        use: [
          MiniCssExtractPlugin.loader,
          {
            loader: 'css-loader',
            options: {
              modules: {
                localIdentName: '[local]-[hash:base64:5]',
                namedExport: false,
                exportLocalsConvention: 'asIs',
              },
              importLoaders: 1,
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
        ],
      },
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
              modules: {
                localIdentName: '[local]-[hash:base64:5]',
                namedExport: false,
                exportLocalsConvention: 'asIs',
              },
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
    runtimeChunk: 'single',
    splitChunks: {
      cacheGroups: {
        vendor: {
          test: /[/\\]node_modules[/\\](react|react-dom)[/\\]/,
          name: 'vendors',
          chunks: 'all',
        },
      },
    },
    minimizer: [
      '...',
      new CssMinimizerPlugin(),
      new ImageMinimizerPlugin({
        test: /\.(jpe?g|png|gif|svg)$/i,
        exclude: [/favicon/i, /image-hero/i],
        minimizer: {
          implementation: ImageMinimizerPlugin.imageminMinify,
          options: {
            plugins: [
              ['gifsicle', { interlaced: true, optimizationLevel: 3 }],
              ['mozjpeg', { quality: 100 }],
              ['pngquant'],
              ['svgo'],
            ],
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
      template: path.resolve(CUR, './src/index-template.html.ejs'),
      favicon: path.resolve(CUR, './src/favicon.ico'),
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
          from: path.resolve(CUR, 'public'),
          to: path.resolve(CUR, 'dist/public'),
          globOptions: { ignore: ['**/img/**'] },
          noErrorOnMissing: true,
        },
        {
          from: path.resolve(CUR, 'public/img'),
          to: path.resolve(CUR, 'dist/img/[path][name].[contenthash][ext]'),
          noErrorOnMissing: true,
        },
        { from: path.resolve(CUR, 'public/robots.txt'), noErrorOnMissing: true },
        { from: path.resolve(CUR, 'public/sitemap.xml'), noErrorOnMissing: true },
      ],
    }),
    new Dotenv({ path: path.resolve(CUR, './.env.prod') }),
    new WebpackManifestPlugin({}),
  ],
};

export default merge(CommonConfig, ProdConfig);
