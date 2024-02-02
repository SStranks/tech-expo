module.exports = {
  extends: 'stylelint-config-standard',
  rules: {
    'declaration-empty-line-before': null,
    'selector-class-pattern': null,
    'comment-empty-line-before': ['always', { ignore: ['after-comment', 'stylelint-commands'] }],
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
