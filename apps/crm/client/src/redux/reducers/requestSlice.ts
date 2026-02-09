import type { PayloadAction } from '@reduxjs/toolkit';

import { createSlice } from '@reduxjs/toolkit';

// TODO:  Check auth flow - what is IRequest supposed to be?
// type Request = {};

type Requests = {
  intervalMs: number;
  maxRequests: number;
  pendingRequests: number;
  queueRequests: Request[];
};

const initialState: Requests = {
  intervalMs: 600,
  maxRequests: 10,
  pendingRequests: 0,
  queueRequests: [],
};

export const requestSlice = createSlice({
  name: 'request',
  initialState,
  reducers: {
    clearQueue(state) {
      state.pendingRequests = 0;
    },
    pushQueue(state, action: PayloadAction<Request>) {
      state.queueRequests.push(action.payload);
      state.pendingRequests += 1;
    },
  },
});

export const { clearQueue, pushQueue } = requestSlice.actions;
export default requestSlice.reducer;
