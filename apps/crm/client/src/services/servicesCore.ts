import { AxiosClient } from '@Lib/axios';

import { ServiceHttp } from './serviceHttp';

export type ServicesCore = ReturnType<typeof createCoreServices>;

export function createCoreServices() {
  const axiosClient = new AxiosClient();
  const serviceHttp = new ServiceHttp(axiosClient);

  return {
    axiosClient,
    serviceHttp,
  };
}
