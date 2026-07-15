import { calculateImpact, type Order } from '@/hooks/useImpact';

describe('calculateImpact', () => {
  it('sums savingAmount from PICKED_UP orders', () => {
    const orders: Order[] = [
      {
        id: '1',
        status: 'PICKED_UP',
        savingAmount: 15000,
        items: [{ quantity: 2 }, { quantity: 1 }],
      } as Order,
      {
        id: '2',
        status: 'PICKED_UP',
        savingAmount: 10000,
        items: [{ quantity: 1 }],
      } as Order,
      {
        id: '3',
        status: 'CANCELLED',
        savingAmount: 5000,
        items: [{ quantity: 1 }],
      } as Order,
    ];

    const result = calculateImpact(orders);
    expect(result.moneySaved).toBe(25000);
  });

  it('sums item quantities for foodSaved', () => {
    const orders: Order[] = [
      {
        id: '1',
        status: 'PICKED_UP',
        savingAmount: 1000,
        items: [{ quantity: 3 }, { quantity: 2 }],
      } as Order,
    ];

    const result = calculateImpact(orders);
    expect(result.foodSaved).toBe(5);
  });

  it('returns zeros for empty orders', () => {
    expect(calculateImpact([])).toEqual({ moneySaved: 0, foodSaved: 0 });
  });
});
