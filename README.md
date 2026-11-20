# Buen Origen

Frontend de una tienda de productos sustentables de productores locales. El proyecto incluye un catálogo por categorías, fichas de producto, búsqueda, favoritos, carrito y un flujo de compra de demostración.

## Inicio rápido

Necesitas **Node.js 22.12 o posterior** y **npm**.

```sh
git clone https://github.com/bootcamp-uchile-2026/grupo-2-frontend.git
cd grupo-2-frontend
npm ci
npm run dev
```

Abre [http://localhost:5173](http://localhost:5173) o la dirección que indique Vite. El comando también inicia la API simulada en el puerto `3100`. No necesitas levantarla por separado ni instalar una base de datos.

## Catálogo y API

El catálogo consulta `GET /products` en el backend compartido. Envía `categoryId` cuando eliges una categoría y usa la paginación y el orden del servidor. Las fichas abiertas desde el catálogo buscan el producto en ese mismo listado y seleccionan el registro por ID. El inicio y el buscador usan datos locales. [Swagger del backend](http://159.112.150.143:3004/api#/Products/ProductsController_findAll)

Las tarjetas del catálogo y las fichas abiertas desde él muestran fotos locales por producto. Cuando no hay una foto asignada, se elige una referencia de la misma categoría y se marca como ilustrativa. El registro de fotografías de referencia está en [scripts/product-photo-sources.json](scripts/product-photo-sources.json).

| Variable                | Valor por defecto             | Uso                                                                                                                                  |
| ----------------------- | ----------------------------- | ------------------------------------------------------------------------------------------------------------------------------------ |
| `VITE_PRODUCTS_API_URL` | `http://159.112.150.143:3004` | URL base de `GET /products`. Si se define `VITE_API_URL`, hereda ese valor salvo que se configure una URL específica para productos. |
| `VITE_API_URL`          | `/api`                        | URL base del cliente de API. En desarrollo, Vite redirige `/api` a la API simulada.                                                  |
| `API_PORT`              | `3100`                        | Puerto de la API simulada y destino del proxy de desarrollo.                                                                         |

Para usar el catálogo simulado cuando el backend compartido no esté disponible, crea un archivo `.env.local` con esta línea y reinicia Vite.

```dotenv
VITE_PRODUCTS_API_URL=/api
```

## JSON Server para pruebas manuales

El repositorio incluye un conjunto de datos de ejemplo con productos y categorías en [server/db.json-server.json](server/db.json-server.json). Puedes levantarlo por separado para probar consultas HTTP. El frontend no consume este servidor.

```sh
npm run api:json-server
```

En otra terminal:

```sh
curl 'http://127.0.0.1:3101/products?categoryId=4'
```

## Cuenta de demostración

Puedes probar el acceso con `maria@buenorigen.test` y la contraseña `CustomerTest2026!`. Con la configuración de desarrollo, el inicio de sesión usa `POST /api/auth/login` de la API simulada. La recuperación usa el código de prueba `123456`.

El registro, los perfiles, el carrito, los pedidos y los Puntos Verdes de demostración se gestionan en el navegador. El cobro, el seguimiento de pedidos y el acceso con proveedores sociales se simulan.

## Tecnologías

| Tecnología                          | Uso en el proyecto                                         |
| ----------------------------------- | ---------------------------------------------------------- |
| React 19 y TypeScript               | Componentes, pantallas y tipos del frontend                |
| Vite                                | Servidor de desarrollo, proxy local y compilación          |
| React Router                        | Navegación entre catálogo, fichas, carrito y cuenta        |
| Zustand                             | Estado del carrito y los favoritos                         |
| Zod                                 | Validación de formularios de compra                        |
| CSS y Fontsource                    | Estilos, diseño adaptable y tipografía Poppins             |
| Fetch y Node.js                     | Cliente HTTP y servidor de la API simulada                 |
| Node Test Runner, Oxlint y Prettier | Pruebas, lint y formateo mediante los scripts del proyecto |

## Comandos

| Comando                | Qué hace                                                      |
| ---------------------- | ------------------------------------------------------------- |
| `npm run dev`          | Inicia Vite y la API simulada                                 |
| `npm run api`          | Inicia solo la API simulada                                   |
| `npm run build`        | Comprueba TypeScript y genera la compilación en `dist/`       |
| `npm run preview`      | Sirve localmente la última compilación de `dist/`             |
| `npm test`             | Ejecuta pruebas de interfaz, reglas de negocio y API simulada |
| `npm run lint`         | Ejecuta Oxlint                                                |
| `npm run format`       | Aplica el formato del proyecto                                |
| `npm run format:check` | Comprueba el formato                                          |

Después de editar código, ejecuta `npm run format` y `npm run format:check`. Las reglas de formato están en [AGENTS.md](AGENTS.md).

## Estructura

| Ruta              | Contenido                                   |
| ----------------- | ------------------------------------------- |
| `src/pages/`      | Pantallas y flujos principales              |
| `src/components/` | Componentes compartidos                     |
| `src/api/`        | Cliente HTTP y tipos de la API              |
| `src/data/`       | Categorías, catálogo local e imágenes       |
| `src/store/`      | Carrito, favoritos, cuentas y pedidos       |
| `server/`         | API simulada y datos de prueba              |
| `public/img/`     | Imágenes locales                            |
| `scripts/`        | Pruebas, formato y utilidades para imágenes |

## Publicación

Publica el contenido de `dist/` y configura el hosting para servir `index.html` al abrir directamente una ruta de React Router, como `/productos/aromas-y-bienestar`. Si el sitio usa HTTPS, configura `VITE_PRODUCTS_API_URL` antes de compilar con una URL HTTPS o la ruta de un proxy del mismo sitio. El backend compartido usa HTTP. El proxy de Vite funciona en desarrollo. Para usar `/api` en el sitio publicado, esa ruta debe estar configurada en el hosting.

## Licencia

Código bajo [licencia MIT](LICENSE).
