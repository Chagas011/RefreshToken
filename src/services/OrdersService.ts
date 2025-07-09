import { IOrder } from '@/entites/IOrder';
import { httpClient } from './httpClient';

export function OrdersService() {
  const getOrders = async () => {
    const { data } = await httpClient.get<{ orders: IOrder[] }>('/orders');
    return data.orders;
  };

  return {
    getOrders,
  };
}
