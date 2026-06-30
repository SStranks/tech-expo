/* eslint-disable perfectionist/sort-objects */
/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

export default {
  '*': ['secretlint'],
  '*.{js,ts,jsx,tsx}': ['eslint --max-warnings=0 --no-warn-ignored', 'prettier --check'],
  '*.{graphql,html,json,jsonc,json5,yml,yaml}': ['eslint --no-warn-ignored', 'prettier --check'],
  '*.{css, scss, sass}': ['stylelint', 'prettier --check'],
  '*.md': ['prettier --check'],
};
