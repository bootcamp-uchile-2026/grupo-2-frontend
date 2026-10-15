import { createContext, useContext } from 'react';

export type CartItem = {
  name: string;
  price: number;
  size: string;
  color: string;
  qty: number;
};

export function readItems(key: string): CartItem[] {

  try {
    const value: unknown = JSON.parse(localStorage.getItem(key) || '[]');

    return Array.isArray(value)
      ? value.filter(
          (p): p is CartItem =>
            p &&
            typeof p.name === 'string' &&
            Number.isFinite(p.price) &&
            p.price >= 0 &&
            Number.isInteger(p.qty) &&
            p.qty > 0,
        )
      : [];
  } catch {
    return [];
  }
}

export const CartContext = createContext<null | {
  cart: CartItem[];
  setCart: (cart: CartItem[]) => void;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  notify: (message: string) => void;
  message: string;
  count: number;
  total: number;
}>(null);

export function useCart() {

  const value = useContext(CartContext);

  if (!value) throw new Error('Falta CartProvider');

  return value;
}
