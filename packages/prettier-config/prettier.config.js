/* eslint-disable perfectionist/sort-objects */
export default {
  printWidth: 120,
  tabWidth: 2,
  semi: true,
  singleQuote: true,
  jsxSingleQuote: false,
  bracketSpacing: true,
  bracketSameLine: true,
  arrowParens: 'always',
  trailingComma: 'es5',
  overrides: [
    {
      files: ['*.html'],
      options: {
        options: { parser: 'html', htmlWhitespaceSensitivity: 'ignore', xhtml: false },
      },
    },
    {
      files: ['*.yml', '*.yaml'],
      options: {
        bracketSpacing: false,
      },
    },
    {
      /*
       * NOTE:
       * jsonc-eslint-parser; errors for no trailing commas in jsonc
       * https://github.com/prettier/prettier/issues/15956
       */
      files: ['*.jsonc'],
      options: {
        trailingComma: 'none',
      },
    },
  ],
};
