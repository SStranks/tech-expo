import ESLintPlugin from 'eslint-webpack-plugin';
import path from 'node:path';
import fs from 'node:fs';
// import url from 'node:url';

const CWD = process.env.INIT_CWD;
// const CUR = path.dirname(url.fileURLToPath(import.meta.url));

// Find entry file for both JS and TS based projects.
const entryFile = fs.readdirSync(path.resolve(CWD, './src')).filter((file) => file.match(/index\.(jsx?|tsx)/));

const CommonConfig = {
  // context: CUR,
  entry: path.resolve(CWD, `./src/${entryFile}`),
  // entry: path.resolve(CWD, './src/index.tsx'),
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.json'],
    // For use in CSS url() imports e.g url(~svg/desktop/a.svg)
    // Prefix with ~ to initiate module resolver
    modules: ['node_modules', path.resolve(CWD, './src/assets')],
    alias: {
      '#Shared': path.resolve(CWD, '../shared'),
      '#Img': path.resolve(CWD, 'src/assets/img'),
      '#Sass': path.resolve(CWD, 'src/assets/sass'),
      '#Svg': path.resolve(CWD, 'src/assets/svg'),
      '#Components': path.resolve(CWD, 'src/components'),
      '#Context': path.resolve(CWD, 'src/context'),
      '#Data': path.resolve(CWD, 'src/data'),
      '#Features': path.resolve(CWD, 'src/features'),
      '#Hooks': path.resolve(CWD, 'src/hooks'),
      '#Layouts': path.resolve(CWD, 'src/layouts'),
      '#Lib': path.resolve(CWD, 'src/lib'),
      '#Modules': path.resolve(CWD, 'src/modules'),
      '#Pages': path.resolve(CWD, 'src/pages'),
      '#Routes': path.resolve(CWD, 'src/routes'),
      '#Services': path.resolve(CWD, 'src/services'),
      '#Stories': path.resolve(CWD, 'src/stories'),
      '#Types': path.resolve(CWD, 'src/types'),
      '#Utils': path.resolve(CWD, 'src/utils'),
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
        test: /\.(png|svg|jpg|jpeg|gif)$/i,
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
      eslintPath: 'eslint/use-at-your-own-risk',
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
  ],
};

export default CommonConfig;
