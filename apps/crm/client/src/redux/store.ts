import { configureStore } from '@reduxjs/toolkit';
import pipelineReducer from '#Features/scrumboard/redux/pipelineSlice';
import kanbanReducer from '#Features/scrumboard/redux/kanbanSlice';

const store = configureStore({
  reducer: {
    scrumboardPipeline: pipelineReducer,
    scrumboardKanban: kanbanReducer,
  },
});

export default store;
export type ReduxStore = typeof store;
export type ReduxDispatch = ReduxStore['dispatch'];
export type ReduxState = ReturnType<ReduxStore['getState']>;
