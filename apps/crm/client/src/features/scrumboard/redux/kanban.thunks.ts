import type { AppThunkApiConfig } from '@Redux/store';

import type {
  CreateStageThunkArg,
  CreateStageThunkReturn,
  CreateTaskThunkArg,
  CreateTaskThunkReturn,
  DeleteStageThunkArg,
  DeleteStageThunkReturn,
  DeleteTaskThunkArg,
  DeleteTaskThunkReturn,
  MoveTaskThunkArg,
  MoveTaskThunkReturn,
  UpdateStageThunkArg,
  UpdateStageThunkReturn,
  UpdateTaskThunkArg,
  UpdateTaskThunkReturn,
} from './kanban.types';

import { createAsyncThunk } from '@reduxjs/toolkit';

import { toUUID } from '@Types/uuid';

import { randomUUID } from 'node:crypto';

export const createTaskThunk = createAsyncThunk<CreateTaskThunkReturn, CreateTaskThunkArg, AppThunkApiConfig>(
  'kanban/createTask',
  async (arg, { rejectWithValue }) => {
    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: CreateTaskThunkReturn = { ...arg, id: toUUID(randomUUID()) };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateTaskThunk = createAsyncThunk<UpdateTaskThunkReturn, UpdateTaskThunkArg, AppThunkApiConfig>(
  'kanban/updateTask',
  async (arg, { rejectWithValue }) => {
    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: UpdateTaskThunkReturn = { ...arg };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const deleteTaskThunk = createAsyncThunk<DeleteTaskThunkReturn, DeleteTaskThunkArg, AppThunkApiConfig>(
  'kanban/deleteTask',
  async (arg, { rejectWithValue }) => {
    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: DeleteTaskThunkReturn = { ...arg };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const moveTaskThunk = createAsyncThunk<MoveTaskThunkReturn, MoveTaskThunkArg, AppThunkApiConfig>(
  'kanban/moveTask',
  async (arg, { getState, rejectWithValue }) => {
    const state = getState();
    const activeRequestId = state.scrumboardKanban.tasks.activeRequestIdByTask[arg.id];

    if (activeRequestId) {
      return rejectWithValue('Move already in progress');
    }

    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: MoveTaskThunkReturn = { ...arg };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const createStageThunk = createAsyncThunk<CreateStageThunkReturn, CreateStageThunkArg, AppThunkApiConfig>(
  'kanban/createStage',
  async (arg, { rejectWithValue }) => {
    try {
      // TODO: Submit to DB
      await new Promise((resolve) => setTimeout(() => resolve(''), 300));
      const fakeBackendResponse: CreateStageThunkReturn = { ...arg, id: toUUID(randomUUID()) };
      return {
        ...fakeBackendResponse,
      };
    } catch (error) {
      return rejectWithValue(error);
    }
  }
);

export const updateStageThunk = createAsyncThunk<UpdateStageThunkReturn, UpdateStageThunkArg, AppThunkApiConfig>(
  'kanban/updateStage',
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
  'kanban/deleteStage',
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
