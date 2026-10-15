import { createContext, useContext } from 'react';
import type { CartItem } from './cart';

export type Profile = {
  id: string;
  name: string;
  lastName: string;
  email: string;
  phone: string;
  rut: string;
  address: string;
  points: number;
  provider?: string;
};

export type AccountRecord = Profile & { passwordHash: string; salt: string };

export type Order = {
  id: string;
  owner: string | null;
  date: string;
  items: CartItem[];
  total: number;
  points: number;
  payment: string;
  address: string;
  delivery: string;
  status: string;
  contact: { name: string; email: string };
};

export function readStored<T>(key: string, fallback: T): T {

  try {
    return JSON.parse(localStorage.getItem(key) || 'null') ?? fallback;
  } catch {
    return fallback;
  }
}

export async function passwordHash(password: string, salt: string) {

  const key = await crypto.subtle.importKey(
    'raw',
    new TextEncoder().encode(password),
    'PBKDF2',
    false,
    ['deriveBits'],
  );
  const bits = await crypto.subtle.deriveBits(
    {
      name: 'PBKDF2',
      salt: new TextEncoder().encode(salt),
      iterations: 100000,
      hash: 'SHA-256',
    },
    key,
    256,
  );

  return Array.from(new Uint8Array(bits), (byte) =>
    byte.toString(16).padStart(2, '0'),
  ).join('');
}

export const passwordValid = (password: string) =>
  password.length >= 8 && /[A-Za-z]/.test(password) && /\d/.test(password);

export const demoAccountSummary = { name: 'Samanta', points: 30000 };

export const demoCredentials = {
  email: 'samanta@buenorigen.cl',
  password: 'BuenOrigen2026',
};

export const AccountContext = createContext<null | {
  user: Profile | null;
  orders: Order[];
  login: (email: string, password: string) => Promise<Profile>;
  register: (name: string, email: string, password: string) => Promise<Profile>;
  socialLogin: (provider: string) => void;
  logout: () => void;
  updateProfile: (values: Partial<Profile>) => void;
  changePassword: (current: string, next: string) => Promise<void>;
  recover: (email: string, next: string) => Promise<void>;
  placeOrder: (order: Order) => void;
}>(null);

export function useAccount() {

  const value = useContext(AccountContext);

  if (!value) throw new Error('Falta AccountProvider');

  return value;
}
