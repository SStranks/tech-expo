interface ImportMetaEnv {
  readonly API_HOST: string;
  readonly ENV: string;
  readonly PUBLIC_URL: string;
  readonly ROLLBAR_ENABLED: string;
  readonly ROLLBAR_POST_CLIENT_ITEM: string;
}

interface ImportMeta {
  readonly env: ImportMetaEnv;
}
