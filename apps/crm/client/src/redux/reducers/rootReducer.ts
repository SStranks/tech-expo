import { combineReducers } from '@reduxjs/toolkit';

import themeReducer from '@Features/header/features/theme/redux/themeSlice';
import kanbanReducer from '@Features/scrumboard/redux/kanban.slice';
import pipelineReducer from '@Features/scrumboard/redux/pipeline.slice';

import authReducer from './authSlice';
import requestReducer from './requestSlice';
import uiReducer from './uiSlice';

const rootReducer = combineReducers({
  auth: authReducer,
  request: requestReducer,
  scrumboardKanban: kanbanReducer,
  scrumboardPipeline: pipelineReducer,
  theme: themeReducer,
  ui: uiReducer,
});

export default rootReducer;
