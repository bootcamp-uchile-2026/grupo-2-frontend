import { useEffect, useState } from 'react';
import type { ReactNode } from 'react';
import { CartContext, readItems } from './cart';
import type { CartItem } from './cart';

export function CartProvider({ children }: { children: ReactNode }) {

  const [cart, setCart] = useState<CartItem[]>(() => readItems('eco-cart'));
  const [message, notify] = useState('');

  useEffect(() => {

    localStorage.setItem('eco-cart', JSON.stringify(cart));
  }, [cart]);

  useEffect(() => {

    if (!message) return;

    const timer = setTimeout(
      () => notify(''),
      message.startsWith('¡Bienvenida') ? 6000 : 2200,
    );

    return () => clearTimeout(timer);
  }, [message]);

  const add = (item: Omit<CartItem, 'qty'>, qty = 1) => {

    setCart((previous) => {

      const found = previous.find(
        (p) =>
          p.name === item.name &&
          p.price === item.price &&
          p.size === item.size &&
          p.color === item.color,
      );

      return found
        ? previous.map((p) => (p === found ? { ...p, qty: p.qty + qty } : p))
        : [...previous, { ...item, qty }];
    });

    notify(`${item.name} se agregó al carrito`);
  };

  return (
    <CartContext.Provider
      value={{
        cart,
        setCart,
        add,
        notify,
        message,
        count: cart.reduce((n, p) => n + p.qty, 0),
        total: cart.reduce((n, p) => n + p.price * p.qty, 0),
      }}
    >
      {children}
    </CartContext.Provider>
  );
}
