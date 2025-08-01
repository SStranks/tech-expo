// NOTE:  MegaLinter v8 only uses '@secretlint/secretlint-rule-preset-recommend'.
// eslint-disable-next-line no-undef -- megalinter requires cjs; secretlint config .js
module.exports = {
  rules: [
    {
      id: '@secretlint/secretlint-rule-preset-recommend',
      rules: [
        {
          id: '@secretlint/secretlint-rule-npm',
          options: {
            allows: [String.raw`/npm_package_config_[a-zA-Z]+/g`],
          },
        },
      ],
    },
  ],
};
