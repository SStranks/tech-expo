import { createSelector, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { ReduxRootState } from '@Redux/store';

export type UiEventScope = 'kanban' | 'pipeline' | 'auth' | 'global';

type UiEventBase = {
  id: string;
  scope: UiEventScope;
};

export type UiEvent =
  | (UiEventBase & { type: 'aria'; data: AriaData })
  | (UiEventBase & { type: 'focus'; data: FocusData })
  | (UiEventBase & { type: 'misc'; data: MiscData });

type AriaData = {
  politeness: 'polite' | 'assertive';
  message: string;
};

type FocusData = {
  entityId: string;
};

type MiscData = {
  message: string;
};

type UiInitialState = {
  events: UiEvent[];
  // focusedId?: string;
  // activeModal?:
};

export const initialState: UiInitialState = {
  events: [],
};

export const uiSlice = createSlice({
  name: 'ui',
  initialState,
  reducers: {
    uiEventConsume: (state, action: PayloadAction<UiEvent>) => {
      state.events = state.events.filter((event) => event.id !== action.payload.id);
    },
    uiEventInsert: (state, action: PayloadAction<UiEvent>) => {
      state.events.push(action.payload);
    },
  },
});

const selectUiState = (state: ReduxRootState) => state.ui;

export const selectorAriaEventsPipeline = createSelector([selectUiState], (data) =>
  data.events.filter((event) => event.scope === 'pipeline' && event.type === 'aria')
);

export const selectorAriaEventsGlobal = createSelector([selectUiState], (data) =>
  data.events.filter((event) => event.scope === 'global' && event.type === 'aria')
);

export const { uiEventConsume, uiEventInsert } = uiSlice.actions;
export default uiSlice.reducer;
