import { getIngredientsApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice } from '@reduxjs/toolkit';

import type { TIngredient } from '@/utils/types';
import type { SerializedError } from '@reduxjs/toolkit';

export const getIngredients = createAsyncThunk('ingredients/fetch', async () => {
  const data = await getIngredientsApi();
  return data;
});

export const ingredientsSlice = createSlice({
  name: 'ingredients',
  initialState: {
    data: [] as TIngredient[],
    isLoading: false,
    error: null as SerializedError | null,
  },
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(getIngredients.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(getIngredients.fulfilled, (state, action) => {
        state.data = action.payload;
        state.isLoading = false;
      })
      .addCase(getIngredients.rejected, (state, action) => {
        state.error = action.error;
        state.isLoading = false;
      });
  },
});

export const ingredientReducer = ingredientsSlice.reducer;
