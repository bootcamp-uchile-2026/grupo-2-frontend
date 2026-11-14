import type { Product } from '../data/products';
import type { Profile } from '../store/account';

// En desarrollo Vite redirige /api al servidor simulado (ver vite.config.ts).
// Cuando exista el backend real basta con definir VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export type Paginated<T> = {
  first: number;
  prev: number | null;
  next: number | null;
  last: number;
  pages: number;
  items: number;
  data: T[];
};

export type ApiProduct = Product & { id: number; image: string | null };

export type ApiCategory = {
  id: string;
  name: string;
  icon: string;
  image: string;
  productCount: number;
  filters: Record<string, string[]>;
};

export type LoginResponse = { accessToken: string; user: Profile };

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {

    super(message);

    this.status = status;
  }
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {

  let response: Response;

  try {
    response = await fetch(API_URL + path, {
      ...init,
      headers: { 'Content-Type': 'application/json', ...init?.headers },
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError')
      throw cause;

    throw new ApiError(
      'No pudimos conectar con el servidor. Inténtalo nuevamente.',
      0,
    );
  }

  const body = await response.json().catch(() => null);

  if (!response.ok)
    throw new ApiError(
      body?.error ??
        (response.status >= 502
          ? 'No pudimos conectar con el servidor. Inténtalo nuevamente.'
          : 'Ocurrió un error inesperado.'),
      response.status,
    );

  return body as T;
}

function query(params: Record<string, string | number | undefined>) {

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params))
    if (value !== undefined && value !== '') search.set(key, String(value));

  return search.toString();
}

export type ProductQuery = {
  page?: number;
  perPage?: number;
  department?: string;
  sort?: 'price' | '-price' | '-id';
  filters?: Record<string, string>;
};

// Campos que guardan varias opciones separadas por coma ("s,m,l").
const listFields = new Set(['size', 'color']);

export function getProducts( { page = 1, perPage = 12, department, sort, filters = {} }: ProductQuery, signal?: AbortSignal, ) {

  const where = Object.fromEntries(
    Object.entries(filters)
      .filter(([, value]) => value && value !== 'all')
      .map(([key, value]) => [
        listFields.has(key) ? key + ':contains' : key,
        value,
      ]),
  );

  return request<Paginated<ApiProduct>>(
    '/productos?' +
      query({
        department,
        _sort: sort,
        _page: page,
        _per_page: perPage,
        ...where,
      }),
    { signal },
  );
}

export function getCategories( { page = 1, perPage = 8 }: { page?: number; perPage?: number } = {}, signal?: AbortSignal, ) {

  return request<Paginated<ApiCategory>>(
    '/categorias?' + query({ _page: page, _per_page: perPage }),
    { signal },
  );
}

export function getCategory(id: string, signal?: AbortSignal) {

  return request<ApiCategory>('/categorias/' + encodeURIComponent(id), {
    signal,
  });
}

export function login(email: string, password: string) {

  return request<LoginResponse>('/login', {
    method: 'POST',
    body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
  });
}
