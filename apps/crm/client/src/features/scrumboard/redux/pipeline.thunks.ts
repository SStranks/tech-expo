import type { AppThunkApiConfig } from '@Redux/store';

import type {
  CreateDealThunkArg,
  CreateDealThunkReturn,
  CreateStageThunkArg,
  CreateStageThunkReturn,
  DeleteDealThunkArg,
  DeleteDealThunkReturn,
  DeleteStageThunkArg,
  DeleteStageThunkReturn,
  MoveDealThunkArg,
  MoveDealThunkReturn,
  UpdateDealThunkArg,
  UpdateDealThunkReturn,
  UpdateStageThunkArg,
  UpdateStageThunkReturn,
} from './pipeline.types';

import { toUUID } from '@apps/crm-shared/utils';
import { createAsyncThunk } from '@reduxjs/toolkit';

import { randomUUID } from 'node:crypto';

export const createDealThunk = createAsyncThunk<CreateDealThunkReturn, CreateDealThunkArg, AppThunkApiConfig>(
  'pipeline/createDeal',
  async (arg, { rejectWithValue }) => {
    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: CreateDealThunkReturn = {
        ...arg,
        id: toUUID(randomUUID()),
      };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateDealThunk = createAsyncThunk<UpdateDealThunkReturn, UpdateDealThunkArg, AppThunkApiConfig>(
  'pipeline/updateDeal',
  async (arg, { rejectWithValue }) => {
    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: UpdateDealThunkReturn = { ...arg };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteDealThunk = createAsyncThunk<DeleteDealThunkReturn, DeleteDealThunkArg, AppThunkApiConfig>(
  'pipeline/deleteDeal',
  async (arg, { rejectWithValue }) => {
    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: DeleteDealThunkReturn = { ...arg };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const moveDealThunk = createAsyncThunk<MoveDealThunkReturn, MoveDealThunkArg, AppThunkApiConfig>(
  'pipeline/moveDeal',
  async (arg, { getState, rejectWithValue }) => {
    const state = getState();
    const activeRequestId = state.scrumboardPipeline.deals.activeRequestIdByDeal[arg.id];

    if (activeRequestId) {
      return rejectWithValue('Move already in progress');
    }

    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: MoveDealThunkReturn = { ...arg };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createStageThunk = createAsyncThunk<CreateStageThunkReturn, CreateStageThunkArg, AppThunkApiConfig>(
  'pipeline/createStage',
  async (arg, { rejectWithValue }) => {
    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: CreateStageThunkReturn = {
        ...arg,
        id: toUUID(randomUUID()),
      };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateStageThunk = createAsyncThunk<UpdateStageThunkReturn, UpdateStageThunkArg, AppThunkApiConfig>(
  'pipeline/updateStage',
  async (arg, { rejectWithValue }) => {
    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: UpdateStageThunkReturn = { ...arg };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteStageThunk = createAsyncThunk<DeleteStageThunkReturn, DeleteStageThunkArg, AppThunkApiConfig>(
  'pipeline/deleteStage',
  async (arg, { rejectWithValue }) => {
    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: DeleteStageThunkReturn = { ...arg };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);
