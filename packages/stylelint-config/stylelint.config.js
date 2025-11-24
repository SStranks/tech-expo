/* eslint-disable perfectionist/sort-objects */
export default {
  extends: [
    'stylelint-config-standard',
    'stylelint-config-standard-scss',
    '@stylistic/stylelint-config',
    'stylelint-config-prettier-scss',
  ],
  plugins: ['@stylistic/stylelint-plugin'],
  rules: {
    '@stylistic/string-quotes': 'single',
    '@stylistic/indentation': null,
    '@stylistic/block-closing-brace-newline-after': ['always', { ignoreAtRules: ['if', 'else'] }],
    '@stylistic/declaration-colon-newline-after': null,
    '@stylistic/value-list-comma-newline-after': null,
    'comment-empty-line-before': ['always', { ignore: ['after-comment', 'stylelint-commands'] }],
    'declaration-empty-line-before': null,
    'selector-class-pattern': null,
    'selector-pseudo-class-no-unknown': [
      true,
      {
        ignorePseudoClasses: ['vertical', 'horizontal', 'export'],
      },
    ],
  },
};
