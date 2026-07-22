// @ts-check
import PluginSecurity from 'eslint-plugin-security';
import globals from 'globals';

const EslintConfigExpress = {
  languageOptions: {
    ecmaVersion: 'latest',
    globals: {
      ...globals.es2021,
    },
    parserOptions: {
      ecmaVersion: 'latest',
    },
    sourceType: 'module',
  },
  plugins: {
    security: PluginSecurity,
  },
  rules: {
    ...PluginSecurity.configs.recommended.rules,
    'arrow-body-style': 'off',
    'no-console': 'off',
    'no-unused-vars': 'off',
  },
};

export default EslintConfigExpress;
