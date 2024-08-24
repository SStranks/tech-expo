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
