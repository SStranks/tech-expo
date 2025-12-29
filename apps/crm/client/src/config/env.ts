const getNodeEnv = () => {
  if (import.meta.env.NODE_ENV === 'development') return import.meta.env.NODE_ENV;
  return 'production';
};

const getBoolean = (value?: string) => {
  if (value === undefined) return false;
  if (value === 'false' || value.toLowerCase() === 'false') return false;
  if (value === 'true' || value.toLowerCase() === 'true') return true;

  throw new Error(`Invalid boolean env value: ${value}`);
};

export const ENV = {
  apiHost: import.meta.env.API_HOST,
  isDev: getNodeEnv() === 'development',
  mode: getNodeEnv(),
  publicUrl: import.meta.env.PUBLIC_URL,
  rollbarEnabled: getBoolean(import.meta.env.ROLLBAR_ENABLED),
  rollbarPostClientItem: import.meta.env.ROLLBAR_POST_CLIENT_ITEM,
};
