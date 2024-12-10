import { combineReducers, configureStore } from '@reduxjs/toolkit';

import themeReducer from '@Features/header/features/theme/redux/themeSlice';
import kanbanReducer from '@Features/scrumboard/redux/kanbanSlice';
import pipelineReducer from '@Features/scrumboard/redux/pipelineSlice';

import authReducer from './reducers/authSlice';
import requestReducer from './reducers/requestSlice';

const store = configureStore({
  reducer: {
    auth: authReducer,
    request: requestReducer,
    scrumboardKanban: kanbanReducer,
    scrumboardPipeline: pipelineReducer,
    theme: themeReducer,
  },
});

// For Jest testing
const rootReducer = combineReducers({
  auth: authReducer,
  request: requestReducer,
  scrumboardKanban: kanbanReducer,
  scrumboardPipeline: pipelineReducer,
  theme: themeReducer,
});

// For Jest testing
export function setupStore(preloadedState?: Partial<ReduxRootState>) {
  return configureStore({
    preloadedState,
    reducer: rootReducer,
  });
}

export default store;
export type ReduxRootState = ReturnType<typeof rootReducer>;
export type ReduxStoreSetup = ReturnType<typeof setupStore>;
export type ReduxStore = typeof store;
export type ReduxDispatch = ReduxStore['dispatch'];
export type ReduxState = ReturnType<ReduxStore['getState']>;
