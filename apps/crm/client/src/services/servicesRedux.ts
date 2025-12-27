import type { ReduxStore } from '@Redux/store';

import type { ServicesCore } from './servicesCore';

import { createReduxAuthAdapter } from '@Redux/adapters/reduxAuthAdapter';

import ServiceAuth from './serviceAuth';

export function createReduxServices(coreServices: ServicesCore, store: ReduxStore) {
  const authState = createReduxAuthAdapter(store);

  const serviceAuth = new ServiceAuth(coreServices.axiosClient, authState);

  return {
    serviceAuth,
  };
}
