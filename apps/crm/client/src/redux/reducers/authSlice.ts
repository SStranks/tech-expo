import { createAsyncThunk, createSlice, PayloadAction } from '@reduxjs/toolkit';

import { serviceHttp } from '@Services/index';
import { TBody } from '@Services/serviceHttp';

interface IAuth {
  user: string | null;
  roles: string[];
  authTokenExpiry: Date | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  authTokenPending: boolean;
  refreshTokenActivated: boolean;
  refreshTokenPending: boolean;
  status: 'idle' | 'pending';
}

export const initialState: IAuth = {
  authTokenExpiry: null,
  authTokenPending: false,
  isAuthenticated: false,
  isInitialized: false,
  refreshTokenActivated: false,
  refreshTokenPending: false,
  roles: [],
  status: 'idle',
  user: null,
};

export const authInitialize = createAsyncThunk('auth/initialize', async () => {
  const response = await serviceHttp.accountIdentify();
  return response;
});

export const identify = createAsyncThunk('auth/identify', async () => {
  const response = await serviceHttp.accountIdentify();
  return response;
});

export const login = createAsyncThunk('auth/login', async (body: TBody) => {
  const response = await serviceHttp.accountLogin(body);
  return response;
});

export const logout = createAsyncThunk('auth/logout', async () => {
  const response = await serviceHttp.accountLogout();
  return response;
});

export const updatePassword = createAsyncThunk('auth/updatePassword', async (body: TBody) => {
  const response = await serviceHttp.accountUpdatePassword(body);
  return response;
});

export const freezeAccount = createAsyncThunk('auth/freezeAccount', async () => {
  const response = await serviceHttp.accountFreeze();
  return response;
});

export const deleteAccount = createAsyncThunk('auth/deleteAccount', async (body: TBody) => {
  const response = await serviceHttp.accountDelete(body);
  return response;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser(state, action: PayloadAction<IAuth['isAuthenticated']>) {
      state.isAuthenticated = action.payload;
      state.status = 'idle';
    },
    clearAuthState(state) {
      state.status = 'idle';
      state.user = null;
      state.roles = [];
      state.isAuthenticated = false;
      state.authTokenExpiry = null;
      state.authTokenPending = false;
      state.refreshTokenActivated = false;
      state.refreshTokenPending = false;
    },
    setAuthTokenPending(state, action: PayloadAction<IAuth['authTokenPending']>) {
      state.authTokenPending = action.payload;
    },
    setRefreshTokenActivated(state, action: PayloadAction<IAuth['refreshTokenActivated']>) {
      state.refreshTokenActivated = action.payload;
      state.status = 'idle';
    },
    setRefreshTokenPending(state, action: PayloadAction<IAuth['refreshTokenPending']>) {
      state.refreshTokenPending = action.payload;
    },
    setUser(state, action) {
      state.user = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(identify.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(identify.rejected, (state) => {
        state.status = 'idle';
      })
      .addCase(identify.fulfilled, (state, action) => {
        const { user } = action.payload;
        state.status = 'idle';
        state.isAuthenticated = true;
        console.log('C', user);
      })
      .addCase(authInitialize.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(authInitialize.rejected, (state) => {
        state.status = 'idle';
        state.isInitialized = true;
        state.isAuthenticated = false;
      })
      .addCase(authInitialize.fulfilled, (state) => {
        state.status = 'idle';
        state.isInitialized = true;
        state.isAuthenticated = true;
      })
      .addCase(login.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(login.rejected, (state) => {
        state.status = 'idle';
      })
      .addCase(login.fulfilled, (state) => {
        // const { user, roles } = action.payload.data;
        state.status = 'idle';
        state.isAuthenticated = true;
        // state.user = user;
        // state.roles = [...roles];
      })
      .addCase(logout.pending, (state) => {
        state.status = 'pending';
      })
      .addCase(logout.rejected, (state) => {
        state.status = 'idle';
        authSlice.caseReducers.clearAuthState(state);
      })
      .addCase(logout.fulfilled, (state) => {
        state.status = 'idle';
        authSlice.caseReducers.clearAuthState(state);
      })
      .addCase(updatePassword.pending, (state) => {
        state.status = 'pending';
        state.authTokenPending = true;
        state.refreshTokenPending = true;
      })
      .addCase(updatePassword.rejected, (state) => {
        state.status = 'idle';
        state.authTokenPending = false;
        state.refreshTokenPending = false;
      })
      .addCase(updatePassword.fulfilled, (state) => {
        state.status = 'idle';
        authSlice.caseReducers.clearAuthState(state);
      })
      .addCase(freezeAccount.pending, (state) => {
        state.status = 'pending';
        state.authTokenPending = true;
        state.refreshTokenPending = true;
      })
      .addCase(freezeAccount.rejected, (state) => {
        state.status = 'idle';
        state.authTokenPending = false;
        state.refreshTokenPending = false;
      })
      .addCase(freezeAccount.fulfilled, (state) => {
        state.status = 'idle';
        authSlice.caseReducers.clearAuthState(state);
      })
      .addCase(deleteAccount.pending, (state) => {
        state.status = 'pending';
        state.authTokenPending = true;
        state.refreshTokenPending = true;
      })
      .addCase(deleteAccount.rejected, (state) => {
        state.status = 'idle';
        state.authTokenPending = false;
        state.refreshTokenPending = false;
      })
      .addCase(deleteAccount.fulfilled, (state) => {
        state.status = 'idle';
        authSlice.caseReducers.clearAuthState(state);
      });
  },
});

export const {
  authenticateUser,
  clearAuthState,
  setAuthTokenPending,
  setRefreshTokenActivated,
  setRefreshTokenPending,
  setUser,
} = authSlice.actions;
export default authSlice.reducer;
