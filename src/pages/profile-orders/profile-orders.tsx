import { ProfileOrdersUI } from '@ui-pages';
import { TOrder } from '@utils-types';
import { FC } from 'react';
import { useSelector } from '../../services/store';

export const ProfileOrders: FC = () => {
  /** TODO: взять переменную из стора */
  /* ТУТ СКОРЕЕ ВСЕГО НАДО НЕ ИЗ feeds  ПОЛУЧАТЬ ЗАКАЗЫ А ИЗ УЖЕ ЗАКАЗОВ НАСТОЯЩИХ */

  // const { orders, isLoading, totalToday, total } = useSelector((store) => store.feedsData);

  const orders: TOrder[] = [];

  return <ProfileOrdersUI orders={orders} />;
};
