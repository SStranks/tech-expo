import Rollbar from 'rollbar';

import { ENV } from '@Config/env';

const rollbarConfig: Rollbar.Configuration = {
  accessToken: ENV.rollbarPostClientItem,
  captureUncaught: true,
  captureUnhandledRejections: true,
  enabled: ENV.rollbarEnabled,
  environment: ENV.mode,
};

export default new Rollbar(rollbarConfig);
