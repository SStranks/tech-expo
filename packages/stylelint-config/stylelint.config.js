/* eslint-disable perfectionist/sort-objects */
import { defineStylisticOverride } from '@stylistic/stylelint-plugin';

export default {
  extends: ['stylelint-config-standard', 'stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
  rules: {
    'comment-empty-line-before': [
      'always',
      { except: ['first-nested'], ignore: ['after-comment', 'stylelint-commands'] },
    ],
    'declaration-empty-line-before': null,
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['vertical', 'horizontal', 'export'],
      },
    ],
  },
  overrides: [
    defineStylisticOverride({
      files: ['**/*.scss'],
      syntax: 'scss',
      rules: {
        '@stylistic/string-quotes': 'single',
        '@stylistic/indentation': null,
        '@stylistic/declaration-colon-newline-after': null,
        '@stylistic/value-list-comma-newline-after': null,
        '@stylistic/block-closing-brace-newline-after': ['always', { ignoreAtRules: ['if', 'else'] }],
      },
    }),
    {
      files: ['**/*.css'],
      plugins: ['@stylistic/stylelint-plugin'],
      rules: {
        '@stylistic/string-quotes': 'single',
        '@stylistic/indentation': null,
        '@stylistic/declaration-colon-newline-after': null,
        '@stylistic/value-list-comma-newline-after': null,
        '@stylistic/block-closing-brace-newline-after': 'always',
      },
    },
  ],
};
