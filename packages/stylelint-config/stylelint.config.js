/* eslint-disable perfectionist/sort-objects */
export default {
  extends: 'stylelint-config-standard',
  rules: {
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
  overrides: [
    {
      files: ['*.scss', '**/*.scss'],
      extends: ['stylelint-config-standard-scss', 'stylelint-config-prettier-scss'],
    },
  ],
};
