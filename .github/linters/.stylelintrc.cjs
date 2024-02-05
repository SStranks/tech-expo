require('@packages/stylelint-config');

module.exports = {
  extends: '@packages/stylelint-config',
  rules: {
    'at-rule-no-unknown': off,
    'comment-empty-line-before': off,
  },
};
