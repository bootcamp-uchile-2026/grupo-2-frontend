import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import { after, test } from 'node:test';
import { createElement } from 'react';
import { renderToString } from 'react-dom/server';
import { MemoryRouter, Route, Routes } from 'react-router-dom';
import { createServer } from 'vite';

const storage = new Map();
globalThis.localStorage = {
  getItem: (key) => storage.get(key) ?? null,
  setItem: (key, value) => storage.set(key, value),
};

const server = await createServer({ server: { middlewareMode: true } });
const { CartContext, readItems } =
  await server.ssrLoadModule('/src/store/cart.ts');
const { AccountContext, passwordHash, passwordValid } =
  await server.ssrLoadModule('/src/store/account.ts');
const { Product } = await server.ssrLoadModule('/src/pages/Product.tsx');
const { Cart } = await server.ssrLoadModule('/src/pages/Cart.tsx');
const { Checkout } = await server.ssrLoadModule('/src/pages/Checkout.tsx');
const { OrderConfirmation } = await server.ssrLoadModule(
  '/src/components/OrderConfirmation.tsx',
);
const { Account } = await server.ssrLoadModule('/src/pages/Account.tsx');
const { Recovery } = await server.ssrLoadModule('/src/pages/Access.tsx');
const { ShippingForm } = await server.ssrLoadModule(
  '/src/pages/ShippingForm.tsx',
);
const noop = () => {};
test('La confirmación presenta método, dirección y entrega del pedido sin inventar datos de tarjeta', () => {
  const order = {
    id: 'pedido-demo-123',
    contact: { email: 'persona@example.com' },
    payment: 'Tarjeta de débito',
    address: 'Los Aromos 120, Ñuñoa',
    delivery: '21 de octubre de 2026',
    points: 179,
  };
  const html = renderToString(
    createElement(
      MemoryRouter,
      null,
      createElement(OrderConfirmation, {
        order,
        registered: true,
        notify: noop,
      }),
    ),
  );
  for (const value of [
    order.contact.email,
    order.payment,
    order.address,
    order.delivery,
    order.id,
    '179 Puntos Verdes',
    'Método de Pago',
    'Dirección',
    'Fecha de entrega',
  ]) {
    assert.ok(html.replace(/<!--.*?-->/g, '').includes(value), value);
  }
  assert.ok(html.includes(`/mi-cuenta/compras/${order.id}`));
  assert.ok(!html.includes('4321'));
  assert.ok(html.includes('no se realizan cobros ni se envían correos'));
});
const cart = {
  cart: [],
  count: 0,
  total: 0,
  message: '',
  add: noop,
  notify: noop,
  setCart: noop,
};
const account = {
  user: null,
  orders: [],
  login: noop,
  register: noop,
  socialLogin: noop,
  logout: noop,
  updateProfile: noop,
  changePassword: noop,
  recover: noop,
  placeOrder: noop,
};

function render( Component, route, routePattern = '*', props = {}, accountValue = account, ) {
  return renderToString(
    createElement(
      MemoryRouter,
      { initialEntries: [route] },
      createElement(
        CartContext.Provider,
        { value: cart },
        createElement(
          AccountContext.Provider,
          { value: accountValue },
          createElement(
            Routes,
            null,
            createElement(Route, {
              path: routePattern,
              element: createElement(Component, props),
            }),
          ),
        ),
      ),
    ),
  ).replace(/<!--[^]*?-->/g, '');
}

after(async () => {
  await server.close();
});

test('Un producto desconocido muestra error y no permite comprarlo', () => {
  const html = render(
    Product,
    '/productos/ropa-y-accesorios/producto?name=NoExiste',
  );
  assert.match(html, /Producto no encontrado/);
  assert.doesNotMatch(html, /Agregar a carrito/);
});

test('Carrito y checkout vacíos ofrecen volver al catálogo', () => {
  for (const Component of [Cart, Checkout]) {
    const html = render(Component, '/checkout', '*', { openAuth: noop });
    assert.match(html, /Tu carrito está vacío/);
    assert.match(html, /Explorar productos|Seguir comprando/);
    assert.doesNotMatch(html, /Confirmar y pagar/);
  }
});

test('Calle sin número desactiva el campo obligatorio del número', () => {
  const html = render(ShippingForm, '/checkout', '*', {
    confirm: noop,
    noNumber: true,
    setNoNumber: noop,
    contact: { name: '', lastName: '', email: '', phone: '', rut: '' },
  });
  const numberInput = html.match(/<input[^>]*id="street-number"[^>]*>/)?.[0];
  assert.ok(numberInput);
  assert.match(numberInput, /disabled/);
  assert.doesNotMatch(numberInput, /required/);
  assert.match(html, /name="firstName"/);
  const emailInput = html.match(/<input[^>]*name="email"[^>]*>/)?.[0];
  assert.ok(emailInput);
  assert.match(emailInput, /type="email"/);
  assert.match(emailInput, /required/);
});

test('Mis compras no muestra pedidos de otra cuenta', () => {
  const orders = [
    {
      id: 'own',
      owner: 'samanta',
      date: '2026-10-14T12:00:00Z',
      items: [{ name: 'Producto propio' }],
      status: 'Pedido recibido',
      total: 13990,
    },
    {
      id: 'foreign',
      owner: 'otra-cuenta',
      date: '2026-10-14T12:00:00Z',
      items: [{ name: 'Producto privado ajeno' }],
      status: 'Pedido recibido',
      total: 13990,
    },
  ];
  const html = render(
    Account,
    '/mi-cuenta/compras',
    '/mi-cuenta/:section',
    {},
    { ...account, user: { id: 'samanta', name: 'Samanta' }, orders },
  );
  assert.match(html, /Producto propio/);
  assert.doesNotMatch(html, /Producto privado ajeno|foreign/);
});

test('Recuperación ofrece un formulario de correo y retorno al acceso', () => {
  const html = render(Recovery, '/recuperar-cuenta');
  assert.match(html, /Recupera tu cuenta/);
  assert.match(html, /type="email" required/);
  assert.match(html, /Volver a iniciar sesión/);
});

test('Contraseñas débiles se rechazan y el hash usa una sal', async () => {
  assert.equal(passwordValid('abc'), false);
  assert.equal(passwordValid('abcdefgh'), false);
  assert.equal(passwordValid('12345678'), false);
  assert.equal(passwordValid('BuenOrigen2026'), true);
  const hash = await passwordHash('BuenOrigen2026', 'salt-one');
  assert.notEqual(hash, 'BuenOrigen2026');
  assert.equal(hash, await passwordHash('BuenOrigen2026', 'salt-one'));
  assert.notEqual(hash, await passwordHash('BuenOrigen2026', 'salt-two'));
});

test('Un carrito corrupto no impide abrir la aplicación', () => {
  storage.set('bad-cart', 'not-json');
  assert.deepEqual(readItems('bad-cart'), []);
  storage.set(
    'bad-cart',
    JSON.stringify([{ name: 'Producto', price: 100, qty: -1 }]),
  );
  assert.deepEqual(readItems('bad-cart'), []);
});

const { Catalog } = await server.ssrLoadModule('/src/pages/Catalog.tsx');
const { products, productUrl, quickSelection } = await server.ssrLoadModule(
  '/src/data/products.ts',
);
const { categories } = await server.ssrLoadModule('/src/data/categories.ts');

test('Cada categoría muestra exclusivamente sus propios productos', () => {
  for (const category of categories) {
    const own = products.filter(
      (product) => product.department === category.id,
    );
    assert.ok(own.length >= 6, category.name);
    const html = render(
      Catalog,
      `/productos/${category.id}`,
      '/productos/:category',
    );
    for (const product of own)
      assert.ok(html.includes(product.name), product.name);
    for (const product of products.filter(
      (product) => product.department !== category.id,
    ))
      assert.ok(
        !html.includes(product.name),
        `${category.name}: producto ajeno ${product.name}`,
      );
  }
});

test('Las fichas de todas las categorías conservan descripción, precio y enlace propio', () => {
  for (const category of categories) {
    const product = products.find(
      (product) => product.department === category.id,
    );
    const html = render(
      Product,
      productUrl(product),
      '/productos/:category/producto',
    );
    assert.ok(html.includes(product.description), product.name);
    assert.ok(html.includes(product.name), product.name);
    assert.doesNotMatch(html, /Producto no encontrado/);
    assert.ok(html.includes(`href="/productos/${category.id}"`));
  }
});

test('Los productos se agregan con la primera variante disponible', () => {
  for (const product of products) {
    const item = quickSelection(product);
    assert.notEqual(item.size, 'Por elegir', product.name);
    assert.notEqual(item.color, 'Por elegir', product.name);
    assert.ok(item.size && item.color);
  }
  assert.equal(
    quickSelection(products.find((product) => product.name === 'Polera Aurora'))
      .size,
    's',
  );
});

test('Una ficha no acepta un producto de otra categoría', () => {
  const html = render(
    Product,
    '/productos/alimentos/producto?name=Polera%20Aurora',
    '/productos/:category/producto',
  );
  assert.match(html, /Producto no encontrado/);
  assert.doesNotMatch(html, /Agregar a carrito/);
});

const { productImages } = await server.ssrLoadModule(
  '/src/data/productImages.ts',
);

test('Todos los productos tienen una fotografía JPEG local y texto alternativo', async () => {
  for (const product of products) {
    const image = productImages[product.name];
    assert.ok(image, product.name);
    assert.match(image.src, /^\/img\/products\/\d+\.jpg$/);
    assert.ok(image.alt.includes(product.name));
    const data = await readFile(
      new URL('../public' + image.src, import.meta.url),
    );
    assert.ok(data.length > 1000, product.name);
    assert.equal(data[0], 0xff, product.name);
    assert.equal(data[1], 0xd8, product.name);
  }
});

test('Catálogo y ficha muestran la misma fotografía de un producto', () => {
  const product = products.find(
    (product) => product.name === 'Granola Amanecer',
  );
  const source = productImages[product.name].src;
  const catalogue = render(
    Catalog,
    '/productos/alimentos',
    '/productos/:category',
  );
  const detail = render(
    Product,
    productUrl(product),
    '/productos/:category/producto',
  );
  assert.ok(catalogue.includes(`src="${source}"`));
  assert.ok(detail.includes(`src="${source}"`));
});

const { shippingSchema } = await server.ssrLoadModule(
  '/src/pages/shippingSchema.ts',
);
const validShipping = {
  firstName: ' Ana María Isabel ',
  lastName: 'Pérez',
  email: 'ana@example.com',
  rut: '12.345.678-5',
  phone: '+56 9 1234 5678',
  commune: 'Santiago',
  street: 'Los Aromos',
  number: '120',
  noNumber: false,
  unit: '',
  postalCode: '',
  instructions: '',
};

test('Zod valida contacto y dirección y limpia espacios', () => {
  const result = shippingSchema.safeParse(validShipping);
  assert.equal(result.success, true);
  assert.equal(result.data.firstName, 'Ana María Isabel');
  for (const [field, value] of Object.entries({
    firstName: '   ',
    lastName: '',
    email: 'correo',
    rut: '12.345.678-9',
    phone: '123',
    commune: '',
    street: ' ',
    number: '',
    postalCode: '123',
  })) {
    const invalid = shippingSchema.safeParse({
      ...validShipping,
      [field]: value,
    });
    assert.equal(invalid.success, false, field);
    assert.ok(
      invalid.error.issues.some((issue) => issue.path[0] === field),
      field,
    );
  }
});

test('Zod exige al menos tres letras en el nombre', () => {
  for (const firstName of ['', 'C', 'Ca', ' Ca ']) {
    assert.equal(
      shippingSchema.safeParse({ ...validShipping, firstName }).success,
      false,
    );
  }
  for (const firstName of ['Ana', 'Carlos', 'Carlos Ortiz']) {
    assert.equal(
      shippingSchema.safeParse({ ...validShipping, firstName }).success,
      true,
    );
  }
});

test('El formulario comienza sin datos precargados', () => {
  const html = render(ShippingForm, '/checkout', '*', {
    confirm: noop,
    noNumber: false,
    setNoNumber: noop,
  });
  for (const name of ['firstName', 'lastName', 'email', 'rut', 'phone']) {
    const input = html.match(
      new RegExp(`<input[^>]*name="${name}"[^>]*>`),
    )?.[0];
    assert.ok(input);
    assert.doesNotMatch(input, /value="[^"]+"/);
    assert.match(input, /placeholder=/);
  }
});

test('Zod permite dirección sin número y código postal opcional', () => {
  assert.equal(
    shippingSchema.safeParse({
      ...validShipping,
      number: '',
      noNumber: true,
      postalCode: '8320000',
    }).success,
    true,
  );
  assert.equal(
    shippingSchema.safeParse({
      ...validShipping,
      phone: '912345678',
      rut: '123456785',
    }).success,
    true,
  );
});

const { Search } = await server.ssrLoadModule('/src/pages/Search.tsx');
const { Header } = await server.ssrLoadModule(
  '/src/components/Header/Header.tsx',
);
test('El buscador habilitado envía la consulta a resultados', () => {
  const html = render(Header, '/', '*', { openCart: noop });
  assert.match(html, /action="\/buscar"/);
  assert.match(html, /name="q"/);
  assert.match(html, /role="search"/);
});
test('Búsqueda sin resultados presenta ilustración y recomendaciones', () => {
  const html = render(Search, '/buscar?q=producto-inexistente-xyz');
  assert.match(html, /No encontramos tu producto/);
  assert.match(html, /Productos Recomendados/);
  assert.match(html, /Reseñas de nuestros clientes/);
  assert.match(html, /empty-illustration/);
});
test('La búsqueda ignora tildes y devuelve fichas de productos', () => {
  const html = render(Search, '/buscar?q=algodon');
  assert.match(html, /Resultados de búsqueda/);
  assert.match(html, /shop-card/);
  assert.doesNotMatch(html, /No encontramos tu producto/);
});
test('El carrito vacío presenta ilustración y acción para seguir comprando', () => {
  const html = render(Cart, '/carrito', '*', { openAuth: noop });
  assert.match(html, /empty-illustration/);
  assert.match(html, /Seguir comprando/);
  assert.doesNotMatch(html, /Guardados para después/);
});

const { Layout } = await server.ssrLoadModule('/src/components/Layout.tsx');
test('Carrito y panel lateral muestran variantes sin edición y permiten eliminar productos', () => {
  const previous = cart.cart;
  cart.cart = [
    { name: 'Polera Aurora', price: 13990, qty: 1, size: 's', color: 'negro' },
  ];
  try {
    for (const [Component, props] of [
      [Cart, { openAuth: noop }],
      [Layout, { layer: 'cart', setLayer: noop }],
    ]) {
      const html = render(Component, '/carrito', '*', props);
      assert.ok(html.includes('<dt>Talla:</dt><dd>s</dd>'));
      assert.ok(html.includes('<dt>Color:</dt><dd>negro</dd>'));
      assert.match(html, /aria-label="Eliminar Polera Aurora"/);
      assert.doesNotMatch(html, /<select/);
      assert.doesNotMatch(html, />\s*Editar\s*</);
      if (Component === Layout) {
        assert.match(html, /recommendation-carousel/);
        assert.ok(
          html.indexOf('drawer-item') < html.indexOf('recommendation-carousel'),
        );
      }
    }
  } finally {
    cart.cart = previous;
  }
});
