import '@packages/secretlint-config';

export const rules = [
  { id: '@secretlint/secretlint-rule-1password' },
  { id: '@secretlint/secretlint-rule-anthropic' },
  {
    id: '@secretlint/secretlint-rule-aws',
    options: {
      enableIDScanRule: true,
    },
  },
  { id: '@secretlint/secretlint-rule-azure' },
  { id: '@secretlint/secretlint-rule-basicauth' },
  { id: '@secretlint/secretlint-rule-database-connection-string' },
  { id: '@secretlint/secretlint-rule-databricks' },
  { id: '@secretlint/secretlint-rule-docker' },
  { id: '@secretlint/secretlint-rule-figma' },
  { id: '@secretlint/secretlint-rule-filter-comments' },
  { id: '@secretlint/secretlint-rule-gcp' },
  { id: '@secretlint/secretlint-rule-github' },
  { id: '@secretlint/secretlint-rule-gitlab' },
  { id: '@secretlint/secretlint-rule-grafana' },
  { id: '@secretlint/secretlint-rule-groq' },
  { id: '@secretlint/secretlint-rule-hashicorp-vault' },
  { id: '@secretlint/secretlint-rule-huggingface' },
  { id: '@secretlint/secretlint-rule-linear' },
  { id: '@secretlint/secretlint-rule-no-dotenv' },
  { id: '@secretlint/secretlint-rule-no-homedir' },
  { id: '@secretlint/secretlint-rule-no-k8s-kind-secret' },
  { id: '@secretlint/secretlint-rule-notion' },
  {
    id: '@secretlint/secretlint-rule-npm',
    options: {
      allows: [String.raw`/npm_package_config_[a-zA-Z]+/g`],
    },
  },
  { id: '@secretlint/secretlint-rule-openai' },
  {
    id: '@secretlint/secretlint-rule-pattern',
    options: {
      patterns: [
        {
          name: 'key-value secret',
          pattern: String.raw`/^\b(?<key>(\w+_)?(password|pass|key|secret))\b\s*[:=]\s*(?<value>.+)/i`,
        },
      ],
    },
  },
  { id: '@secretlint/secretlint-rule-privatekey' },
  { id: '@secretlint/secretlint-rule-secp256k1-privatekey' },
  { id: '@secretlint/secretlint-rule-sendgrid' },
  { id: '@secretlint/secretlint-rule-shopify' },
  { id: '@secretlint/secretlint-rule-slack' },
  { id: '@secretlint/secretlint-rule-vercel' },
];
