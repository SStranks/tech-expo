interface ImportMetaEnv {
  readonly NODE_ENV: string;
  readonly PUBLIC_URL: string;
  readonly API_HOST: string;
  readonly ROLLBAR_ENABLED: string;
  readonly ROLLBAR_POST_CLIENT_ITEM: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
