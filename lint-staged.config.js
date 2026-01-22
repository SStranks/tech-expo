/**
 * @filename: lint-staged.config.js
 * @type {import('lint-staged').Configuration}
 */

export default {
  '*': ['secretlint'],
  // '*': ['secretlint', 'editorconfig-checker'],
  // '.{css, scss, sass}': ['stylelint', 'prettier --check'],
  // '*.sh': 'shellcheck',
  // '*.css': ['stylelint', 'prettier --check'],
  // 'Dockerfile*': 'hadolint',
  // '.env*': 'dotenv-linter',
  // '*.graphql': ['eslint', 'prettier --check'],
  // '*.html': ['eslint', 'htmlhint', 'prettier --check'],
  // '*.{js,ts,jsx,tsx}': ['eslint --max-warnings=0', 'prettier --check'],
  // '*.json': ['eslint', 'prettier --check'],
  // '*.md': ['markdownlint-cli2', 'prettier --check'],
  // '*.{yml,yaml}': ['eslint', 'yamllint', 'prettier --check'],
};
