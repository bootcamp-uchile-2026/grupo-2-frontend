import { useStore } from 'zustand';
import { createStore } from 'zustand/vanilla';
import { products, quickSelection } from '../data/products';

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
          (p): p is CartItem => p &&
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

type CartState = {
  cart: CartItem[];
  setCart: (update: CartItem[] | ((cart: CartItem[]) => CartItem[])) => void;
  add: (item: Omit<CartItem, 'qty'>, qty?: number) => void;
  notify: (message: string) => void;
  message: string;
};

const cartKey = 'eco-cart';

export const cartStore = createStore<CartState>()((set, get) => {

  let notificationTimer: ReturnType<typeof setTimeout> | undefined;

  return {
    cart: readItems(cartKey).map((item) => {

      const product = products.find((product) => product.name === item.name);

      if (!product) return item;

      const defaults = quickSelection(product);

      return {
        ...item,
        size:
          !item.size || item.size === 'Por elegir' ? defaults.size : item.size,
        color:
          !item.color || item.color === 'Por elegir'
            ? defaults.color
            : item.color,
      };
    }),
    message: '',
    setCart: (update) => set(({ cart }) => ({
        cart: typeof update === 'function' ? update(cart) : update,
      })),
    add: (item, qty = 1) => {

      const { setCart, notify } = get();

      setCart((cart) => {

        const found = cart.find(
          (p) => p.name === item.name &&
            p.price === item.price &&
            p.size === item.size &&
            p.color === item.color,
        );

        return found
          ? cart.map((p) => (p === found ? { ...p, qty: p.qty + qty } : p))
          : [...cart, { ...item, qty }];
      });

      notify(`${item.name} se agregó al carrito`);
    },
    notify: (message) => {

      clearTimeout(notificationTimer);

      set({ message });

      if (message) {
        notificationTimer = setTimeout(
          () => set({ message: '' }),
          message.startsWith('¡Bienvenida') ? 2000 : 2200,
        );
      }
    },
  };
});

function saveCart(cart: CartItem[]) {

  try {
    localStorage.setItem(cartKey, JSON.stringify(cart));
  } catch {
    // El carrito sigue disponible en memoria si el navegador bloquea el almacenamiento.
  }
}

saveCart(cartStore.getState().cart);

cartStore.subscribe(({ cart }, previous) => {

  if (cart !== previous.cart) saveCart(cart);
});

export function useCart<T>(selector: (state: CartState) => T) {

  return useStore(cartStore, selector);
}

export const selectCartCount = ({ cart }: CartState) => cart.reduce((count, item) => count + item.qty, 0);

export const selectCartTotal = ({ cart }: CartState) => cart.reduce((total, item) => total + item.price * item.qty, 0);
