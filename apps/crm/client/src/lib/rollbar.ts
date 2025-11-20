import Rollbar from 'rollbar';

const { NODE_ENV, ROLLBAR_ENABLED, ROLLBAR_POST_CLIENT_ITEM = 'token' } = process.env;

const rollbarConfig: Rollbar.Configuration = {
  accessToken: ROLLBAR_POST_CLIENT_ITEM,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: ROLLBAR_ENABLED === 'true',
  environment: NODE_ENV,
};

export default new Rollbar(rollbarConfig);
