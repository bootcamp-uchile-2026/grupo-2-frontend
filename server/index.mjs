// API simulada con el mismo contrato que grupo-2-backend (NestJS), para trabajar sin PostgreSQL.
// Replica `GET /products`, `GET /categories`, `GET /categories/:id` y `POST /auth/login`,
// incluyendo la paginación base 0 (page, size, sortBy, sortDirection) y los errores de NestJS.
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { pathToFileURL } from 'node:url';

const db = JSON.parse(
  readFileSync(new URL('./db.json', import.meta.url), 'utf8'),
);

const productSortFields = [
  'id',
  'name',
  'price',
  'finalPrice',
  'stock',
  'co2Avoided',
  'createdAt',
];
const categorySortFields = ['id', 'name', 'description'];

class HttpError extends Error {
  constructor(status, message, error) {
    super(Array.isArray(message) ? message.join(', ') : message);

    this.body = { message, error, statusCode: status };
  }
}

const badRequest = (message) => new HttpError(400, message, 'Bad Request');

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });

  res.end(JSON.stringify(body));
}

function integer(params, name, fallback, min, max = Infinity) {
  const raw = params.get(name);

  if (raw === null || raw === '') return fallback;

  const value = Number(raw);
  const errors = [];

  if (!Number.isInteger(value))
    errors.push(`${name} must be an integer number`);

  if (value < min) errors.push(`${name} must not be less than ${min}`);

  if (value > max) errors.push(`${name} must not be greater than ${max}`);

  if (errors.length) throw badRequest(errors);

  return value;
}

function paginate(items, params, sortFields) {
  const page = integer(params, 'page', 0, 0);
  const size = integer(params, 'size', 20, 1, 100);
  const sortBy = params.get('sortBy') ?? 'id';
  const sortDirection = params.get('sortDirection') ?? 'ASC';

  if (!['ASC', 'DESC'].includes(sortDirection))
    throw badRequest([
      'sortDirection must be one of the following values: ASC, DESC',
    ]);

  if (!sortFields.includes(sortBy))
    throw badRequest('Campo de ordenamiento inválido.');

  const direction = sortDirection === 'ASC' ? 1 : -1;
  const sorted = items.toSorted((a, b) => {
    const left = a[sortBy];
    const right = b[sortBy];
    const order =
      typeof left === 'string' ? left.localeCompare(right, 'es') : left - right;

    return order * direction || a.id - b.id;
  });

  return {
    content: sorted.slice(page * size, page * size + size),
    page,
    size,
    totalElements: items.length,
    totalPages: Math.ceil(items.length / size),
    sortBy,
    sortDirection,
  };
}

function productSummary({ description: _description, createdAt: _createdAt, ...summary }) {
  return summary;
}

function listProducts(params) {
  const search = params.get('search')?.trim().toLowerCase();
  const categoryId = integer(params, 'categoryId', undefined, 1);
  const producerId = integer(params, 'producerId', undefined, 1);

  const products = db.products.filter(
    (product) => (!search || product.name.toLowerCase().includes(search)) &&
      (categoryId === undefined || product.categoryId === categoryId) &&
      (producerId === undefined || product.producerId === producerId),
  );
  const result = paginate(products, params, productSortFields);

  return { ...result, content: result.content.map(productSummary) };
}

function findCategory(raw) {
  const id = Number(raw);

  if (!/^-?\d+$/.test(raw))
    throw badRequest('Validation failed (numeric string is expected)');

  if (id <= 0)
    throw badRequest('El identificador debe ser un número entero positivo.');

  const category = db.categories.find((item) => item.id === id);

  if (!category) throw new HttpError(404, 'Categoría no encontrada');

  return category;
}

async function readJson(req) {
  let raw = '';

  for await (const chunk of req) raw += chunk;

  try {
    return JSON.parse(raw || '{}');
  } catch {
    throw badRequest('Unexpected token in JSON body');
  }
}

async function login(req) {
  const body = await readJson(req);
  const errors = [];

  if (
    typeof body.email !== 'string' ||
    !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(body.email.trim())
  )
    errors.push('email must be an email');

  if (typeof body.password !== 'string' || !body.password)
    errors.push('password should not be empty');

  if (errors.length) throw badRequest(errors);

  const email = body.email.trim().toLowerCase();
  const user = db.users.find((account) => account.email === email);

  if (!user || !user.isActive || user.password !== body.password)
    throw new HttpError(401, 'Credenciales inválidas', 'Unauthorized');

  const { password: _password, isActive: _isActive, ...profile } = user;

  return { access_token: randomUUID(), user: profile };
}

async function route(req) {
  const url = new URL(req.url ?? '/', 'http://localhost');
  const path = url.pathname.replace(/\/+$/, '') || '/';

  if (req.method === 'GET' && path === '/products')
    return [200, listProducts(url.searchParams)];

  if (req.method === 'GET' && path === '/categories')
    return [200, paginate(db.categories, url.searchParams, categorySortFields)];

  const category = path.match(/^\/categories\/([^/]+)$/);

  if (req.method === 'GET' && category)
    return [200, findCategory(decodeURIComponent(category[1]))];

  if (req.method === 'POST' && path === '/auth/login')
    return [201, await login(req)];

  throw new HttpError(404, `Cannot ${req.method} ${url.pathname}`, 'Not Found');
}

// Inicia la API; si el puerto ya está ocupado (p. ej. por `npm run api`) reutiliza esa instancia.
export function startApi(port = Number(process.env.API_PORT ?? 3100)) {
  const server = createServer(async (req, res) => {
    // El backend real habilita CORS (app.enableCors()).
    res.setHeader('Access-Control-Allow-Origin', '*');

    res.setHeader(
      'Access-Control-Allow-Headers',
      'Content-Type, Authorization',
    );

    res.setHeader(
      'Access-Control-Allow-Methods',
      'GET,HEAD,PUT,PATCH,POST,DELETE',
    );

    if (req.method === 'OPTIONS') return void res.writeHead(204).end();

    try {
      const [status, body] = await route(req);

      send(res, status, body);
    } catch (error) {
      if (error instanceof HttpError)
        return send(res, error.body.statusCode, error.body);

      console.error(error);

      send(res, 500, { statusCode: 500, message: 'Internal server error' });
    }
  });

  return new Promise((resolve, reject) => {
    server.once('error', (error) => {
      if (error.code !== 'EADDRINUSE') return reject(error);

      console.log(`API simulada ya activa en http://localhost:${port}`);

      resolve(null);
    });

    server.listen(port, () => {
      console.log(`API simulada en http://localhost:${port}`);
      console.log(
        'GET  /products?page=0&size=12&categoryId=6&sortBy=finalPrice&sortDirection=ASC',
      );
      console.log('GET  /categories?page=0&size=8');
      console.log('POST /auth/login { email, password }');

      resolve(server);
    });
  });
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href)
  await startApi();
