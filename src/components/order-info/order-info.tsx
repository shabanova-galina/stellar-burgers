import { useSelector, useDispatch } from '@/services/store';
import { getOrderByNumber } from '@/slices/feedSlice';
import { getIngredients } from '@/slices/ingredientSlice';
import { Preloader, OrderInfoUI } from '@ui';
import { useMemo, useEffect } from 'react';
import { useParams } from 'react-router-dom';

import type { TIngredient } from '@utils-types';

export const OrderInfo = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const { number } = useParams<{ number: string }>();

  const order = useSelector((state) => state.feed.currentOrder);
  const isLoadingOrder = useSelector((state) => state.feed.isLoading);

  const ingredients = useSelector((state) => state.ingredients.data);
  const isLoadingIngredients = useSelector((state) => state.ingredients.isLoading);

  useEffect(() => {
    if (number) {
      void dispatch(getOrderByNumber(Number(number)));
    }

    if (!ingredients.length && !isLoadingIngredients) {
      void dispatch(getIngredients());
    }
  }, [dispatch, number, ingredients.length, isLoadingIngredients]);

  const orderInfo = useMemo(() => {
    if (!order || isLoadingOrder || isLoadingIngredients || !ingredients.length) {
      return null;
    }

    const date = new Date(order.createdAt);

    const ingredientMap = new Map(ingredients.map((ing) => [ing._id, ing]));

    const ingredientsInfo = order.ingredients.reduce(
      (acc: Record<string, TIngredient & { count: number }>, item: string) => {
        if (!acc[item]) {
          const ingredient = ingredientMap.get(item);
          if (ingredient) {
            acc[item] = { ...ingredient, count: 1 };
          }
        } else {
          acc[item].count++;
        }
        return acc;
      },
      {}
    );

    const total = Object.values(ingredientsInfo).reduce(
      (acc, item) => acc + item.price * item.count,
      0
    );

    return {
      ...order,
      ingredientsInfo,
      date,
      total,
    };
  }, [order, ingredients, isLoadingOrder, isLoadingIngredients]);

  if (!orderInfo) {
    return <Preloader />;
  }

  return <OrderInfoUI orderInfo={orderInfo} />;
};
