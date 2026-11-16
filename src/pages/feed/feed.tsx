import { useSelector, useDispatch } from '@/services/store';
import { getFeed } from '@/slices/feedSlice';
import { Preloader } from '@ui';
import { FeedUI } from '@ui-pages';
import { useEffect } from 'react';

export const Feed = (): React.JSX.Element => {
  const orders = useSelector((state) => state.feed.orders);
  const dispatch = useDispatch();

  useEffect(() => {
    void dispatch(getFeed());
  }, [dispatch]);

  const handleGetFeeds = (): void => {
    void dispatch(getFeed());
  };

  if (!orders.length) {
    return <Preloader />;
  }

  return <FeedUI orders={orders} handleGetFeeds={handleGetFeeds} />;
};
