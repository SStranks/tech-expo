import Rollbar from 'rollbar';

const rollbarConfig: Rollbar.Configuration = {
  accessToken: process.env.ROLLBAR_POST_SERVER_ITEM,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: process.env.ROLLBAR_ENABLED?.toLowerCase() === 'true',
  environment: process.env.NODE_ENV,
};

const rollbar = new Rollbar(rollbarConfig);

export default rollbar;
