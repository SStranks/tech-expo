import { authInitialize, hydrateAuth } from '@Redux/reducers/authSlice';
import configureReduxStore from '@Redux/store';
import { createCoreServices } from '@Services/servicesCore';
import { createReduxServices } from '@Services/servicesRedux';

import { ENV } from './env';
import { globalErrorHandler } from './globalOnError';

export async function initializeApp() {
  const coreServices = createCoreServices();
  const reduxStore = configureReduxStore({
    serviceHttp: coreServices.serviceHttp,
  });
  const reduxServices = createReduxServices(coreServices, reduxStore);

  if (ENV.mode === 'development') {
    globalErrorHandler();
    reduxStore.dispatch(
      hydrateAuth({
        user: {
          client_id: '_dev_',
          role: 'USER',
        },
      })
    );

    return { coreServices, reduxStore };
  }

  await reduxStore.dispatch(authInitialize());
  await reduxServices.serviceAuth.initInterceptors();

  return { coreServices, reduxStore };
}
