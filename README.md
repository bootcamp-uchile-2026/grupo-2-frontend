# Buen Origen

Prototipo React, TypeScript y Vite con navegación mediante React Router. `old/` conserva el desarrollo original como referencia.

## Ejecutar y verificar

```sh
npm install
npm run dev
npm run build
npm run lint
npm test
npm run format:check
```

`npm run format` conserva imports en una línea y separa con líneas en blanco los bloques de variables, efectos, métodos y retorno.

## Organización

- `src/pages/`: inicio, catálogo, producto, carrito, checkout, acceso, recuperación y Mi cuenta.
- `src/components/`: navegación, categorías, formularios, modales y componentes compartidos.
- `src/store/`: carrito, cuentas de demostración y pedidos locales.
- `src/data/`: catálogo simulado y categorías.
- `src/index.css`: estilos originales y ajustes UX/UI.
- `scripts/ux-ui.test.mjs`: pruebas de estados de error, validación y separación de pedidos por cuenta.

## Rutas

- `/`
- `/productos/:category`
- `/productos/ropa-y-accesorios/producto?name=Polera%20Aurora`
- `/carrito`
- `/checkout`
- `/acceso`
- `/recuperar-cuenta`
- `/mi-cuenta/compras`
- `/mi-cuenta/compras/:orderId`
- `/mi-cuenta/puntos-verdes`
- `/mi-cuenta/datos-personales`

Las rutas anteriores de `moda-natural` y los enlaces HTML existentes redirigen a las rutas nuevas conservando parámetros y anclas. El hosting debe servir `index.html` al entrar directamente a una ruta React.

## Ajustes UX/UI

Se implementaron los nombres de categorías y los cambios de las ocho capturas del documento: tarjetas de categorías en la portada, catálogo sin pestañas de subcategorías ni bloque de destacados, tarjetas con descripción y agregado rápido, carrito lateral con recomendaciones y una sola acción final, retorno al carrito desde checkout y confirmación de los datos antes del pago.

El carrito permite guardar, restaurar, editar y eliminar productos. Un pago rechazado conserva los productos. Un pedido confirmado aparece en Mi cuenta con detalle, estado, seguimiento y ayuda. El flujo de compra funciona con un producto sin restringir las compras de varios productos.

## Cuenta y servicios de demostración

Cuenta de prueba:

- Correo: `samanta@buenorigen.cl`
- Contraseña: `BuenOrigen2026`

El registro local valida la contraseña (8 caracteres como mínimo, una letra y un número). Las contraseñas se guardan como hashes PBKDF2 con sal. La recuperación usa el código de prueba `123456`; no se envía un correo real. Los botones Google, Apple y Facebook abren una confirmación de acceso con una cuenta ficticia, sin OAuth externo.

Los pagos, fechas de entrega, seguimiento, Puntos Verdes y solicitudes de ayuda son simulaciones. La regla local de puntos es 1 punto por cada $100 y 1 punto para canjear $1; no representa una política comercial definida. La iteración completa de Puntos Verdes queda fuera de esta entrega, según el documento. El cupón no aplica descuentos. Las ocho categorías tienen catálogo propio: 13 productos de ropa y accesorios y 6 productos por cada categoría restante (55 productos en total). Los precios, descripciones y presentaciones son datos ficticios para el prototipo. Los filtros, fichas, recomendaciones y opciones de compra se adaptan a la categoría.

Los datos se almacenan en este dispositivo: `eco-cart`, `eco-saved`, `eco-accounts`, `eco-orders` y `eco-help` en localStorage; `eco-session` en sessionStorage. Este prototipo no implementa autenticación, recuperación ni pagos aptos para producción. Esas funciones requieren backend, verificación real de identidad y proveedores externos.

## Fotografías del catálogo

Los 55 productos usan fotografías reales e ilustrativas de Pexels, guardadas en `public/img/products/`. Las mismas fotos se reutilizan en tarjetas, fichas, recomendaciones, carrito y pedidos. No se depende de imágenes externas al navegar.

`scripts/product-photo-sources.json` registra la página original y la licencia de cada fotografía. `src/data/productImages.ts` relaciona las fotos con los productos. Para recuperar los archivos faltantes se puede ejecutar `node scripts/download-product-photos.mjs` y luego `npm run format`.

Las imágenes son referencias visuales del prototipo: no representan fotografías del inventario real ni implican respaldo de las personas o marcas que aparecen en ellas. Las condiciones de uso están en https://www.pexels.com/license/.
