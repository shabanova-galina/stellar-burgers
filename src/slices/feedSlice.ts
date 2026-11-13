import { getFeedsApi, getOrderByNumberApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TOrder } from '@/utils/types';

export const getFeed = createAsyncThunk('feed/fetch', async () => {
  const data = await getFeedsApi();
  return data;
});

export const getOrderByNumber = createAsyncThunk(
  'feed/getOrderByNumber',
  async (number: number) => {
    const response = await getOrderByNumberApi(number);
    return response.orders[0];
  }
);

export const feedSlice = createSlice({
  name: 'feed',
  initialState: {
    orders: [] as TOrder[],
    total: 0 as number,
    totalToday: 0 as number,
    isLoading: false as boolean,
    error: null as string | null,
    currentOrder: null as TOrder | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getFeed.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getFeed.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload.orders;
        state.total = action.payload.total;
        state.totalToday = action.payload.totalToday;
      })
      .addCase(getFeed.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.error.message ?? 'Что-то пошло не так';
      })
      .addCase(getOrderByNumber.pending, (state) => {
        state.currentOrder = null;
        state.isLoading = true;
      })
      .addCase(getOrderByNumber.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(getOrderByNumber.rejected, (state) => {
        state.isLoading = false;
      });
  },
});

export const feedReducer = feedSlice.reducer;
