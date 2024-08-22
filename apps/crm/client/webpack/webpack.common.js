// @ts-check
import ESLintPlugin from 'eslint-webpack-plugin';
import path from 'node:path';
// import url from 'node:url';

const CUR = './';
// const CUR = path.dirname(url.fileURLToPath(import.meta.url));

/** @type { import('webpack').Configuration } */
const CommonConfig = {
  entry: path.resolve(CUR, './src/index.tsx'),
  target: 'web',
  resolve: {
    extensions: ['.ts', '.tsx', '.js', '.jsx', '.mjs', '.cjs', '.json'],
    // For use in CSS url() imports e.g url(~svg/desktop/a.svg)
    // Prefix with ~ to initiate module resolver
    modules: ['node_modules', path.resolve(CUR, './src/assets')],
    alias: {
      '#Shared': path.resolve(CUR, '../shared'),
      '#Img': path.resolve(CUR, 'src/assets/img'),
      '#Sass': path.resolve(CUR, 'src/assets/sass'),
      '#Svg': path.resolve(CUR, 'src/assets/svg'),
      '#Components': path.resolve(CUR, 'src/components'),
      '#Context': path.resolve(CUR, 'src/context'),
      '#Data': path.resolve(CUR, 'src/data'),
      '#Features': path.resolve(CUR, 'src/features'),
      '#Hooks': path.resolve(CUR, 'src/hooks'),
      '#Layouts': path.resolve(CUR, 'src/layouts'),
      '#Lib': path.resolve(CUR, 'src/lib'),
      '#Modules': path.resolve(CUR, 'src/modules'),
      '#Pages': path.resolve(CUR, 'src/pages'),
      '#Redux': path.resolve(CUR, 'src/redux'),
      '#Routes': path.resolve(CUR, 'src/routes'),
      '#Services': path.resolve(CUR, 'src/services'),
      '#Stories': path.resolve(CUR, 'src/stories'),
      '#Types': path.resolve(CUR, 'src/types'),
      '#Utils': path.resolve(CUR, 'src/utils'),
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
      eslintPath: 'eslint/use-at-your-own-risk',
      extensions: ['js', 'jsx', 'ts', 'tsx'],
    }),
  ],
};

export default CommonConfig;
