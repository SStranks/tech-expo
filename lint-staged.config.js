/* eslint-disable unicorn/filename-case */

/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

export default {
  '*': ['secretlint'],
  '*.{css, scss, sass}': ['stylelint', 'prettier --check'],
  '*.{graphql,html,html,json,jsonc,json5,yml,yaml}': ['eslint --no-warn-ignored', 'prettier --check'],
  '*.{js,ts,jsx,tsx}': ['eslint --max-warnings=0 --no-warn-ignored', 'prettier --check'],
  '*.md': ['prettier --check'],
};
