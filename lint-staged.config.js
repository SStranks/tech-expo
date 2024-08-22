/* eslint-disable unicorn/filename-case */
export default {
  '*.{js,jsx,ts,tsx}': 'eslint --no-warn-ignored',
  '*.{css,scss}': 'stylelint',
  '*': 'secretlint --maskSecrets',
};
