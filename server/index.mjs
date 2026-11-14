// API simulada mientras el backend real no está disponible.
// json-server expone `productos`, `categorias` y `usuarios` con paginación (_page, _per_page),
// y este archivo agrega `POST /login`, que json-server no trae por defecto.
import { createServer } from 'node:http';
import { randomUUID } from 'node:crypto';
import { readFileSync, writeFileSync } from 'node:fs';
import { createApp } from 'json-server/lib/app.js';

const file = new URL('./db.json', import.meta.url);
const port = Number(process.env.API_PORT ?? 3000);

const db = {
  data: JSON.parse(readFileSync(file, 'utf8')),
  async read() {
    this.data = JSON.parse(readFileSync(file, 'utf8'));
  },
  async write() {
    writeFileSync(file, JSON.stringify(this.data, null, 2) + '\n');
  },
};

const app = createApp(db);

function send(res, status, body) {
  res.writeHead(status, { 'Content-Type': 'application/json' });
  res.end(JSON.stringify(body));
}

async function readBody(req) {
  let raw = '';

  for await (const chunk of req) raw += chunk;

  return JSON.parse(raw || '{}');
}

async function login(req, res) {
  let body;

  try {
    body = await readBody(req);
  } catch {
    return send(res, 400, { error: 'El cuerpo debe ser JSON válido.' });
  }

  const email = String(body.email ?? '')
    .trim()
    .toLowerCase();
  const password = String(body.password ?? '');

  if (!email || !password)
    return send(res, 400, { error: 'Correo y contraseña son obligatorios.' });

  const user = (db.data.usuarios ?? []).find(
    (account) => account.email === email && account.password === password,
  );

  if (!user)
    return send(res, 401, {
      error: 'El correo o la contraseña son incorrectos. Inténtalo nuevamente.',
    });

  const { password: _password, ...profile } = user;

  send(res, 200, { accessToken: randomUUID(), user: profile });
}

createServer((req, res) => {
  if (req.method === 'POST' && req.url?.split('?')[0] === '/login')
    return void login(req, res);

  app.handler(req, res);
}).listen(port, () => {
  console.log(`API simulada en http://localhost:${port}`);
  console.log('GET  /productos?_page=1&_per_page=12');
  console.log('GET  /categorias?_page=1&_per_page=8');
  console.log('POST /login { email, password }');
});
