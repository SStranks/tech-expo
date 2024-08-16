import { configureStore } from '@reduxjs/toolkit';
import pipelineReducer from '#Features/scrumboard/redux/pipelineSlice';

const store = configureStore({
  reducer: {
    scrumboardPipeline: pipelineReducer,
  },
});

export default store;
export type ReduxStore = typeof store;
export type ReduxDispatch = ReduxStore['dispatch'];
export type ReduxState = ReturnType<ReduxStore['getState']>;
