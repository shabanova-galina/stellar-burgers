import { useDispatch, useSelector } from '@/services/store';
import { getOrders } from '@/slices/userOrdersSlice';
import { ProfileOrdersUI } from '@ui-pages';
import { useEffect } from 'react';

export const ProfileOrders = (): React.JSX.Element => {
  const dispatch = useDispatch();
  const orders = useSelector((state) => state.userOrders.orders);

  useEffect(() => {
    void dispatch(getOrders());
  }, [dispatch]);

  return <ProfileOrdersUI orders={orders} />;
};
