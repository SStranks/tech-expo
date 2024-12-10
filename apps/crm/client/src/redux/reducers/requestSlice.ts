/* eslint-disable perfectionist/sort-objects */
import { createSlice, PayloadAction } from '@reduxjs/toolkit';

// TODO:  Check auth flow - what is IRequest supposed to be?
interface IRequest {}

interface IRequests {
  intervalMs: number;
  maxRequests: number;
  pendingRequests: number;
  queueRequests: IRequest[];
}

const initialState: IRequests = {
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
    pushQueue(state, action: PayloadAction<IRequest>) {
      state.queueRequests.push(action.payload);
      state.pendingRequests += 1;
    },
  },
});

export const { clearQueue, pushQueue } = requestSlice.actions;
export default requestSlice.reducer;
