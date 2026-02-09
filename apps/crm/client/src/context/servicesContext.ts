import type { IServiceHttp } from '@Services/serviceHttp';

import { createContext, useContext } from 'react';

type ServicesContext = {
  serviceHttp: IServiceHttp;
};

export const ServicesContext = createContext<ServicesContext | null>(null);

export const useServicesContext = () => {
  const context = useContext(ServicesContext);
  if (!context) throw new Error('useServicesContext out of scope of ServicesContext.Provider');
  return context;
};
