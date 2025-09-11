import Rollbar from 'rollbar';

const { NODE_ENV, ROLLBAR_ENABLED, ROLLBAR_POST_SERVER_ITEM } = process.env;

const rollbarConfig: Rollbar.Configuration = {
  accessToken: ROLLBAR_POST_SERVER_ITEM,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: ROLLBAR_ENABLED?.toLowerCase() === 'true',
  environment: NODE_ENV,
};

const rollbar = new Rollbar(rollbarConfig);

export default rollbar;
