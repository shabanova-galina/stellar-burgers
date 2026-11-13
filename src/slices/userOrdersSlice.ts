import { getOrdersApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import { logoutUser } from './authSlice';

import type { TOrder } from '@/utils/types';

export const getOrders = createAsyncThunk('userOrders/fetch', async () => {
  const data = await getOrdersApi();
  return data;
});

export const userOrdersSlice = createSlice({
  name: 'userOrders',
  initialState: {
    orders: [] as TOrder[],
    isLoading: false,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getOrders.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.orders = [];
      });
  },
});

export const userOrdersReducer = userOrdersSlice.reducer;
