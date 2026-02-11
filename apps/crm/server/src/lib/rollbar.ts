import Rollbar from 'rollbar';

import { env } from '#Config/env.js';

const { NODE_ENV, ROLLBAR_ENABLED, ROLLBAR_POST_SERVER_ITEM } = env;

const rollbarConfig: Rollbar.Configuration = {
  accessToken: ROLLBAR_POST_SERVER_ITEM,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: ROLLBAR_ENABLED.toLowerCase() === 'true',
  environment: NODE_ENV,
};

const rollbar = new Rollbar(rollbarConfig);

export default rollbar;
