import {
  getUserApi,
  registerUserApi,
  loginUserApi,
  logoutApi,
  updateUserApi,
} from '@/utils/burger-api';
import { setCookie, deleteCookie } from '@/utils/cookie';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TRegisterData, TLoginData } from '@/utils/burger-api';
import type { SerializedError } from '@reduxjs/toolkit';

export const updateUser = createAsyncThunk(
  'auth/update',
  async (user: Partial<TRegisterData>) => {
    const response = await updateUserApi(user);
    return response;
  }
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  const response = await logoutApi();
  deleteCookie('accessToken');
  localStorage.removeItem('refreshToken');
  return response;
});

export const loginUser = createAsyncThunk('auth/login', async (data: TLoginData) => {
  const response = await loginUserApi(data);
  setCookie('accessToken', response.accessToken);
  localStorage.setItem('refreshToken', response.refreshToken);
  return response;
});

export const registerUser = createAsyncThunk(
  'auth/register',
  async (data: TRegisterData) => {
    const response = await registerUserApi(data);
    setCookie('accessToken', response.accessToken);
    localStorage.setItem('refreshToken', response.refreshToken);
    return response;
  }
);

export const getUser = createAsyncThunk('auth/fetch', async () => {
  const response = await getUserApi();
  return response;
});

export const authSlice = createSlice({
  name: 'auth',
  initialState: {
    user: {
      name: '',
      email: '',
    },
    loggedIn: false,
    isAuthChecked: false,
    error: null as SerializedError | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(registerUser.fulfilled, (state, action) => {
        state.loggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(getUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
        state.loggedIn = true;
        state.isAuthChecked = true;
      })
      .addCase(getUser.rejected, (state) => {
        state.loggedIn = false;
        state.isAuthChecked = true;
      })
      .addCase(loginUser.fulfilled, (state, action) => {
        state.loggedIn = true;
        state.user = action.payload.user;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.user = {
          name: '',
          email: '',
        };
        state.loggedIn = false;
      })
      .addCase(updateUser.fulfilled, (state, action) => {
        state.user = action.payload.user;
      })
      .addCase(updateUser.rejected, (state, action) => {
        state.error = action.error;
      });
  },
});

export const authReducer = authSlice.reducer;
