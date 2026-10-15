import { useState } from 'react';
import type { ReactNode } from 'react';
import { AccountContext, readStored, passwordHash, passwordValid, demoCredentials } from './account';
import type { AccountRecord, Profile, Order } from './account';

function publicProfile(record: AccountRecord): Profile {

  const { passwordHash: _hash, salt: _salt, ...profile } = record;

  return profile;
}

export function AccountProvider({ children }: { children: ReactNode }) {

  const [user, setUser] = useState<Profile | null>(() => {

    const id = sessionStorage.getItem('eco-session');
    const record = readStored<AccountRecord[]>('eco-accounts', []).find(
      (account) => account.id === id,
    );

    return record ? publicProfile(record) : null;
  });
  const [orders, setOrders] = useState<Order[]>(() =>
    readStored('eco-orders', []),
  );

  function startSession(record: AccountRecord) {

    sessionStorage.setItem('eco-session', record.id);

    setUser(publicProfile(record));

    return publicProfile(record);
  }

  async function login(email: string, password: string) {

    const normalized = email.trim().toLowerCase();
    const accounts = readStored<AccountRecord[]>('eco-accounts', []);
    let record = accounts.find((account) => account.email === normalized);

    if (
      !record &&
      normalized === demoCredentials.email &&
      password === demoCredentials.password
    ) {
      const salt = crypto.randomUUID();

      record = {
        id: crypto.randomUUID(),
        name: 'Samanta',
        lastName: '',
        email: normalized,
        phone: '',
        rut: '',
        address: '',
        points: 30000,
        salt,
        passwordHash: await passwordHash(password, salt),
      };

      localStorage.setItem(
        'eco-accounts',
        JSON.stringify([...accounts, record]),
      );
    }

    if (
      !record ||
      record.provider ||
      (await passwordHash(password, record.salt)) !== record.passwordHash
    )
      throw new Error(
        'El correo o la contraseña son incorrectos. Inténtalo nuevamente.',
      );

    return startSession(record);
  }

  async function register(name: string, email: string, password: string) {

    if (!passwordValid(password))
      throw new Error(
        'Contraseña inválida. Usa al menos 8 caracteres, una letra y un número.',
      );

    const accounts = readStored<AccountRecord[]>('eco-accounts', []);
    const normalized = email.trim().toLowerCase();

    if (accounts.some((account) => account.email === normalized))
      throw new Error(
        'Ya existe una cuenta con este correo. Inicia sesión o recupera tu cuenta.',
      );

    const salt = crypto.randomUUID();
    const record: AccountRecord = {
      id: crypto.randomUUID(),
      name: name.trim(),
      lastName: '',
      email: normalized,
      phone: '',
      rut: '',
      address: '',
      points: 0,
      salt,
      passwordHash: await passwordHash(password, salt),
    };

    localStorage.setItem('eco-accounts', JSON.stringify([...accounts, record]));

    return startSession(record);
  }

  function socialLogin(provider: string) {

    const accounts = readStored<AccountRecord[]>('eco-accounts', []);
    const record = accounts.find(
      (account) => account.provider === provider,
    ) || {
      id: crypto.randomUUID(),
      name: 'Cuenta de prueba',
      lastName: '',
      email: `${provider.toLowerCase()}@example.com`,
      phone: '',
      rut: '',
      address: '',
      points: 0,
      provider,
      salt: '',
      passwordHash: '',
    };

    if (!accounts.some((account) => account.id === record.id))
      localStorage.setItem(
        'eco-accounts',
        JSON.stringify([...accounts, record]),
      );

    startSession(record);
  }

  function logout() {

    sessionStorage.removeItem('eco-session');

    setUser(null);
  }

  function updateProfile(values: Partial<Profile>) {

    if (!user) return;

    const updated = { ...user, ...values, id: user.id, email: user.email };
    const accounts = readStored<AccountRecord[]>('eco-accounts', []).map(
      (account) =>
        account.id === user.id ? { ...account, ...updated } : account,
    );

    localStorage.setItem('eco-accounts', JSON.stringify(accounts));

    setUser(updated);
  }

  async function replacePassword(id: string, next: string) {

    if (!passwordValid(next))
      throw new Error(
        'Contraseña inválida. Usa al menos 8 caracteres, una letra y un número.',
      );

    const accounts = readStored<AccountRecord[]>('eco-accounts', []);
    const salt = crypto.randomUUID();
    const hash = await passwordHash(next, salt);

    localStorage.setItem(
      'eco-accounts',
      JSON.stringify(
        accounts.map((account) =>
          account.id === id
            ? { ...account, salt, passwordHash: hash }
            : account,
        ),
      ),
    );
  }

  async function changePassword(current: string, next: string) {

    const record = readStored<AccountRecord[]>('eco-accounts', []).find(
      (account) => account.id === user?.id,
    );

    if (
      !record ||
      (await passwordHash(current, record.salt)) !== record.passwordHash
    )
      throw new Error('La contraseña actual es incorrecta.');

    await replacePassword(record.id, next);
  }

  async function recover(email: string, next: string) {

    const record = readStored<AccountRecord[]>('eco-accounts', []).find(
      (account) =>
        account.email === email.trim().toLowerCase() && !account.provider,
    );

    if (!record)
      throw new Error(
        'No encontramos una cuenta con ese correo. Revisa tus datos o crea una cuenta.',
      );

    await replacePassword(record.id, next);
  }

  function placeOrder(order: Order) {

    const updated = [...readStored<Order[]>('eco-orders', []), order];

    localStorage.setItem('eco-orders', JSON.stringify(updated));

    setOrders(updated);

    if (user)
      updateProfile({
        points:
          Math.max(
            0,
            user.points - (order.payment === 'Puntos Verdes' ? order.total : 0),
          ) + order.points,
      });
  }

  return (
    <AccountContext.Provider
      value={{
        user,
        orders,
        login,
        register,
        socialLogin,
        logout,
        updateProfile,
        changePassword,
        recover,
        placeOrder,
      }}
    >
      {children}
    </AccountContext.Provider>
  );
}
