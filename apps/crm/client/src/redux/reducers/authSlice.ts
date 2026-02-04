import type {
  ApiResponseSuccess,
  DeleteAccountRequestDTO,
  IdentifyResponse,
  LoginRequestDTO,
  LoginResponse,
  UpdatePasswordRequestDTO,
  UpdatePasswordResponse,
  UserRoles,
  UUID,
} from '@apps/crm-shared';
import type { PayloadAction } from '@reduxjs/toolkit';

import type { AppThunkApiConfig, ReduxRootState } from '@Redux/store';

import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

export type AuthInitialState = {
  user: {
    client_id: UUID;
    role: UserRoles;
  } | null;
  authTokenExpiry: Date | null;
  isAuthenticated: boolean;
  isInitialized: boolean;
  authTokenPending: boolean;
  refreshTokenActivated: boolean;
  refreshTokenPending: boolean;
  status: 'idle' | 'pending';
};

export const initialState: AuthInitialState = {
  authTokenExpiry: null,
  authTokenPending: false,
  isAuthenticated: false,
  isInitialized: false,
  refreshTokenActivated: false,
  refreshTokenPending: false,
  status: 'idle',
  user: null,
};

export const authInitialize = createAsyncThunk<IdentifyResponse, void, AppThunkApiConfig>(
  'auth/initialize',
  async (_, { extra, rejectWithValue }) => {
    try {
      const response = await extra.serviceHttp.account.identify();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const identify = createAsyncThunk<IdentifyResponse, void, AppThunkApiConfig>(
  'auth/identify',
  async (_, { extra, rejectWithValue }) => {
    try {
      const response = await extra.serviceHttp.account.identify();
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const login = createAsyncThunk<LoginResponse, LoginRequestDTO, AppThunkApiConfig>(
  'auth/login',
  async (body: LoginRequestDTO, { extra, rejectWithValue }) => {
    try {
      const response = await extra.serviceHttp.account.login(body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const logout = createAsyncThunk<ApiResponseSuccess, void, AppThunkApiConfig>(
  'auth/logout',
  async (_, { extra, rejectWithValue }) => {
    try {
      const response = await extra.serviceHttp.account.logout();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updatePassword = createAsyncThunk<UpdatePasswordResponse, UpdatePasswordRequestDTO, AppThunkApiConfig>(
  'auth/updatePassword',
  async (body: UpdatePasswordRequestDTO, { extra, rejectWithValue }) => {
    try {
      const response = await extra.serviceHttp.account.updatepassword(body);
      return response.data;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const freezeAccount = createAsyncThunk<ApiResponseSuccess, void, AppThunkApiConfig>(
  'auth/freezeAccount',
  async (_, { extra, rejectWithValue }) => {
    try {
      const response = await extra.serviceHttp.account.freeze();
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteAccount = createAsyncThunk<ApiResponseSuccess, DeleteAccountRequestDTO, AppThunkApiConfig>(
  'auth/deleteAccount',
  async (body: DeleteAccountRequestDTO, { extra, rejectWithValue }) => {
    try {
      const response = await extra.serviceHttp.account.delete(body);
      return response;
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    authenticateUser(state, action: PayloadAction<AuthInitialState['isAuthenticated']>) {
      state.isAuthenticated = action.payload;
      state.status = 'idle';
    },
    clearAuthState(state) {
      state.status = 'idle';
      state.user = null;
      state.isAuthenticated = false;
      state.authTokenExpiry = null;
      state.authTokenPending = false;
      state.refreshTokenActivated = false;
      state.refreshTokenPending = false;
    },
    hydrateAuth(state, action: PayloadAction<IdentifyResponse>) {
      state.user = action.payload.user;
      state.isAuthenticated = true;
      state.status = 'idle';
    },
    setAuthTokenPending(state, action: PayloadAction<AuthInitialState['authTokenPending']>) {
      state.authTokenPending = action.payload;
    },
    setRefreshTokenActivated(state, action: PayloadAction<AuthInitialState['refreshTokenActivated']>) {
      state.refreshTokenActivated = action.payload;
      state.status = 'idle';
    },
    setRefreshTokenPending(state, action: PayloadAction<AuthInitialState['refreshTokenPending']>) {
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
        state.user = null;
        state.isInitialized = true;
        state.isAuthenticated = false;
        state.status = 'idle';
      })
      .addCase(identify.fulfilled, (state, action) => {
        authSlice.caseReducers.hydrateAuth(state, action);
        state.isInitialized = true;
        state.status = 'idle';
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

export const selectorAuthTokenPending = (state: ReduxRootState) => state.auth.authTokenPending;

export const {
  authenticateUser,
  clearAuthState,
  hydrateAuth,
  setAuthTokenPending,
  setRefreshTokenActivated,
  setRefreshTokenPending,
  setUser,
} = authSlice.actions;
export default authSlice.reducer;
