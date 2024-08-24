import Rollbar from 'rollbar';

const rollbarConfig: Rollbar.Configuration = {
  enabled: process.env.ROLLBAR_ENABLED?.toLowerCase() === 'true',
  accessToken: process.env.ROLLBAR_POST_SERVER_ITEM,
  environment: process.env.NODE_ENV,
  captureUncaught: true,
  captureUnhandledRejections: true,
};

const rollbar = new Rollbar(rollbarConfig);

export default rollbar;
