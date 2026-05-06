import type { ReduxDispatch, ReduxRootState } from './store';

import { addListener, createListenerMiddleware } from '@reduxjs/toolkit';

export const listenerMiddleware = createListenerMiddleware();
export const listenerMiddlewareStartListening = listenerMiddleware.startListening.withTypes<
  ReduxRootState,
  ReduxDispatch
>();
export const addAppListener = addListener.withTypes<ReduxRootState, ReduxDispatch>();
