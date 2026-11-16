import { authReducer } from '@/slices/authSlice';
import { constructorReducer } from '@/slices/constructorSlice';
import { feedReducer } from '@/slices/feedSlice';
import { ingredientReducer } from '@/slices/ingredientSlice';
import { userOrdersReducer } from '@/slices/userOrdersSlice';
import { combineReducers } from '@reduxjs/toolkit';

export const rootReducer = combineReducers({
  ingredients: ingredientReducer,
  burgerConstructor: constructorReducer,
  auth: authReducer,
  userOrders: userOrdersReducer,
  feed: feedReducer,
});
