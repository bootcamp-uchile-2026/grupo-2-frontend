// Cliente de la API. Por ahora consume la API simulada (server/index.mjs), que replica el contrato
// de grupo-2-backend: GET /products, GET /categories, GET /categories/:categoryId y POST /auth/login.
// Vite redirige /api a la API simulada (ver vite.config.ts); las pruebas usan VITE_API_URL.
const API_URL = import.meta.env.VITE_API_URL ?? '/api';

export type SortDirection = 'ASC' | 'DESC';

// Respuesta paginada del backend (page comienza en 0).
export type Page<T> = {
  content: T[];
  page: number;
  size: number;
  totalElements: number;
  totalPages: number;
  sortBy: string;
  sortDirection: SortDirection;
};

export type PageQuery<SortField extends string = string> = {
  page?: number;
  size?: number;
  sortBy?: SortField;
  sortDirection?: SortDirection;
};

// ProductSummaryDto
export type ApiProduct = {
  id: number;
  name: string;
  producerId: number;
  producerName: string;
  categoryId: number;
  price: number;
  offerPrice: number | null;
  finalPrice: number;
  discountPercentage: number;
  stock: number;
  available: boolean;
  co2Avoided: number;
  greenPoints: number;
  rating: number | null;
  reviewCount: number;
  attributes?: string[];
  primaryImageFileId: string | null;
};

// CategoryDto
export type ApiCategory = {
  id: number;
  name: string;
  description: string | null;
};

export type UserRole = 'ADMIN' | 'CUSTOMER' | 'PRODUCER';

// LoginResponseDto
export type LoginResponse = {
  access_token: string;
  user: {
    id: number;
    email: string;
    firstName: string;
    lastName: string | null;
    role: UserRole;
    customerId: number | null;
    producerId: number | null;
  };
};

export type ProductSortField =
  'id' | 'name' | 'price' | 'finalPrice' | 'stock' | 'co2Avoided' | 'createdAt';

export type ProductQuery = PageQuery<ProductSortField> & {
  search?: string;
  categoryId?: number;
  producerId?: number;
};

export type CategoryQuery = PageQuery<'id' | 'name' | 'description'>;

const connectionError =
  'No pudimos conectar con el servidor. Inténtalo nuevamente.';

export class ApiError extends Error {
  status: number;

  constructor(message: string, status: number) {

    super(message);

    this.status = status;
  }
}

// NestJS responde { statusCode, message, error }, donde message puede ser un arreglo de validaciones.
function errorMessage(body: unknown, status: number) {

  const message = (body as { message?: unknown } | null)?.message;

  if (Array.isArray(message)) return message.join('. ');

  if (typeof message === 'string' && message) return message;

  return status >= 502 ? connectionError : 'Ocurrió un error inesperado.';
}

async function request<T>(path: string, init?: RequestInit): Promise<T> {

  let response: Response;

  try {
    response = await fetch(API_URL + path, {
      ...init,
      headers: {
        Accept: 'application/json',
        ...(init?.body ? { 'Content-Type': 'application/json' } : {}),
        ...init?.headers,
      },
    });
  } catch (cause) {
    if (cause instanceof DOMException && cause.name === 'AbortError')
      throw cause;

    throw new ApiError(connectionError, 0);
  }

  const body = await response.json().catch(() => null);

  if (!response.ok)
    throw new ApiError(errorMessage(body, response.status), response.status);

  return body as T;
}

function query(params: Record<string, string | number | undefined>) {

  const search = new URLSearchParams();

  for (const [key, value] of Object.entries(params))
    if (value !== undefined && value !== '') search.set(key, String(value));

  return search.toString();
}

export function getProducts( { page = 0, size = 12, sortBy, sortDirection, search, categoryId, producerId, }: ProductQuery = {}, signal?: AbortSignal, ) {

  return request<Page<ApiProduct>>(
    '/products?' +
      query({
        page,
        size,
        sortBy,
        sortDirection,
        search: search?.trim(),
        categoryId,
        producerId,
      }),
    { signal },
  );
}

export function getCategories( { page = 0, size = 20, sortBy, sortDirection }: CategoryQuery = {}, signal?: AbortSignal, ) {

  return request<Page<ApiCategory>>(
    '/categories?' + query({ page, size, sortBy, sortDirection }),
    { signal },
  );
}

export function getCategory(id: number, signal?: AbortSignal) {

  return request<ApiCategory>('/categories/' + id, { signal });
}

export async function login(email: string, password: string) {

  try {
    return await request<LoginResponse>('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ email: email.trim().toLowerCase(), password }),
    });
  } catch (cause) {
    // 400 (formato inválido) y 401 (credenciales o cuenta desactivada) se muestran con un mismo mensaje.
    if (
      cause instanceof ApiError &&
      (cause.status === 400 || cause.status === 401)
    )
      throw new ApiError(
        'El correo o la contraseña son incorrectos. Inténtalo nuevamente.',
        cause.status,
      );

    throw cause;
  }
}
