import type { PayloadAction } from '@reduxjs/toolkit';

import type { ReduxRootState } from '@Redux/store';

import { createSelector, createSlice } from '@reduxjs/toolkit';

export type UiEventScope = 'kanban' | 'pipeline' | 'auth' | 'global';

type UiEventBase = {
  id: string;
  scope: UiEventScope;
};

export type UiEvent =
  | (UiEventBase & { data: AriaData; type: 'aria' })
  | (UiEventBase & { data: FocusData; type: 'focus' })
  | (UiEventBase & { data: MiscData; type: 'misc' });

type AriaData = {
  message: string;
  politeness: 'polite' | 'assertive';
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
