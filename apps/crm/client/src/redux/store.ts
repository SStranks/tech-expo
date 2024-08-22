import { configureStore } from '@reduxjs/toolkit';
import pipelineReducer from '#Features/scrumboard/redux/pipelineSlice';
import kanbanReducer from '#Features/scrumboard/redux/kanbanSlice';
import themeReducer from '#Features/header/features/theme/redux/themeSlice';

const store = configureStore({
  reducer: {
    theme: themeReducer,
    scrumboardPipeline: pipelineReducer,
    scrumboardKanban: kanbanReducer,
  },
});

export default store;
export type ReduxStore = typeof store;
export type ReduxDispatch = ReduxStore['dispatch'];
export type ReduxState = ReturnType<ReduxStore['getState']>;
