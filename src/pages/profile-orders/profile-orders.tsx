import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC, useEffect } from 'react';
import { useSelector, useDispatch } from '../../services/store';
import { getFeeds } from '../../services/feedsSlice';

export const ProfileOrders: FC = () => {
  const dispatch = useDispatch();
  /** TODO: взять переменную из стора */
  const { orders } = useSelector((store) => store.feedsData);
  useEffect(() => {
    if (!orders || orders.length === 0) {
      dispatch(getFeeds());
    }
  }, []);

  return <ProfileOrdersUI orders={orders} />;
};
