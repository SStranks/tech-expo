/* eslint-disable unicorn/filename-case */
/* eslint-disable perfectionist/sort-objects */
export default {
  '*.{js,jsx,ts,tsx}': 'eslint --no-warn-ignored',
  '*.{css,scss}': 'stylelint',
  '*': 'secretlint --maskSecrets',
};
