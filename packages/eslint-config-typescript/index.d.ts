import type { Linter } from 'eslint';

export { default as TSEslint } from 'typescript-eslint';

declare const EslintConfigTypescript: Linter.Config;
export default EslintConfigTypescript;
