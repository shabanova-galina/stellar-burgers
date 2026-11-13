import { orderBurgerApi } from '@/utils/burger-api';
import { createAsyncThunk, createSlice, nanoid } from '@reduxjs/toolkit';

import type { PayloadAction } from '@reduxjs/toolkit';
import type {
  TConstructorIngredient,
  TConstructorState,
  TOrder,
  TIngredient,
} from '@utils-types';

export const createOrder = createAsyncThunk<TOrder, string[]>(
  'burgerConstructor/createOrder',
  async (ingredientsIds: string[]) => {
    const response = await orderBurgerApi(ingredientsIds);
    return response.order;
  }
);

export const constructorSlice = createSlice({
  name: 'burgerConstructor',
  initialState: {
    constructorItems: {
      bun: null as TConstructorIngredient | null,
      ingredients: [] as TConstructorIngredient[],
    } as TConstructorState,
    orderRequest: false,
    orderModalData: null as TOrder | null,
  },
  reducers: {
    addItem: {
      prepare: (item: TIngredient) => ({
        payload: {
          item,
          id: nanoid(),
        },
      }),
      reducer: (state, action: PayloadAction<{ item: TIngredient; id: string }>) => {
        const newIngredient = { ...action.payload.item, id: action.payload.id };
        if (newIngredient.type === 'bun') {
          state.constructorItems.bun = newIngredient;
        } else {
          state.constructorItems.ingredients.push(newIngredient);
        }
      },
    },
    removeItem: (state, action: PayloadAction<string>) => {
      state.constructorItems.ingredients = state.constructorItems.ingredients.filter(
        (i) => i.id !== action.payload
      );
      if (state.constructorItems.bun?.id === action.payload)
        state.constructorItems.bun = null;
    },
    clearOrder: (state) => {
      state.constructorItems = { bun: null, ingredients: [] };
      state.orderModalData = null;
    },
    moveIngredient: (
      state,
      action: PayloadAction<{ fromIndex: number; toIndex: number }>
    ) => {
      const { fromIndex, toIndex } = action.payload;
      const ingredients = state.constructorItems.ingredients;
      if (
        fromIndex < 0 ||
        toIndex < 0 ||
        fromIndex >= ingredients.length ||
        toIndex >= ingredients.length
      ) {
        return;
      }
      const [movedItem] = ingredients.splice(fromIndex, 1);
      ingredients.splice(toIndex, 0, movedItem);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(createOrder.pending, (state) => {
        state.orderRequest = true;
      })
      .addCase(createOrder.fulfilled, (state, action) => {
        state.orderRequest = false;
        state.orderModalData = action.payload;
      })
      .addCase(createOrder.rejected, (state) => {
        state.orderRequest = false;
      });
  },
});

export const { addItem, removeItem, clearOrder, moveIngredient } =
  constructorSlice.actions;

export const constructorReducer = constructorSlice.reducer;
