import { useOrders } from './useOrders';

export interface Order {
  id: string;
  status: string;
  savingAmount: number;
  items: Array<{ quantity: number }>;
}

export interface Impact {
  moneySaved: number;
  foodSaved: number;
}

export function calculateImpact(orders: Order[]): Impact {
  const pickedUp = orders.filter(o => o.status === 'PICKED_UP');
  const moneySaved = pickedUp.reduce((sum, o) => sum + o.savingAmount, 0);
  const foodSaved = pickedUp.reduce(
    (sum, o) => sum + o.items.reduce((s, i) => s + i.quantity, 0),
    0
  );
  return { moneySaved, foodSaved };
}

export function useImpact(): Impact & { isLoading: boolean } {
  const { data, isLoading } = useOrders();
  const orders = data?.orders ?? [];

  return { ...calculateImpact(orders), isLoading };
}
