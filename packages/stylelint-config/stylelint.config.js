/* eslint-disable perfectionist/sort-objects */
import { defineStylistic, defineStylisticOverride } from '@stylistic/stylelint-plugin';

export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    'stylelint-config-recommended-scss',
    '@stylistic/stylelint-config',
    'stylelint-config-prettier-scss',
  ],
  plugins: ['@stylistic/stylelint-plugin'],
  rules: {
    ...defineStylistic({
      rules: {
        'string-quotes': 'single',
        'declaration-block-single-line-max-declarations': null,
        indentation: null,
        'block-closing-brace-newline-after': ['always', { ignoreAtRules: ['if', 'else'] }],
        'declaration-colon-newline-after': null,
        'value-list-comma-newline-after': null,
      },
    }),
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
    {
      files: ['**/*.scss'],
      customSyntax: 'postcss-scss',
      rules: {
        'value-no-invalid': null,
        'selector-no-unmatchable': null,
        'declaration-property-value-no-unknown': null,
      },
    },
    defineStylisticOverride({
      syntax: 'scss',
      files: ['**/*.scss'],
      rules: {
        'string-quotes': 'single',
        indentation: null,
        'block-closing-brace-newline-after': ['always', { ignoreAtRules: ['if', 'else'] }],
        'declaration-colon-newline-after': null,
        'value-list-comma-newline-after': null,
      },
    }),
  ],
};
