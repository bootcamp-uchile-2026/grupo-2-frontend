# Buen Origen — Frontend

Aplicación web desarrollada por el equipo Frontend del Grupo 2 para el **Hito 1 del Caso 2: EcoTienda**, en el Bootcamp de la Universidad de Chile.

Buen Origen es un prototipo de comercio electrónico orientado al consumo consciente. Permite explorar productos sustentables, revisar sus atributos, administrar un carrito y completar un flujo simulado de compra.

## Estado del proyecto

Versión frontend navegable construida con HTML, CSS y JavaScript. Para este hito se utilizan datos simulados y persistencia local; no requiere conexión con un backend.

## Funcionalidades

- Página de inicio con ofertas, productos populares, compromisos, emprendedores y artículos.
- Catálogo de moda natural con categorías, filtros y ordenamiento.
- Vista de detalle con color, talla, cantidad, huella verde, información y valoraciones.
- Carrito lateral con recomendaciones de productos.
- Carrito principal con edición, actualización de cantidades y eliminación de productos.
- Persistencia del carrito mediante `localStorage`.
- Acceso simulado o continuación de la compra como invitado.
- Formulario de despacho, selección de método de pago y resumen de compra.
- Confirmación de compra con código de despacho UUID y botón para copiarlo.

## Tecnologías utilizadas

- HTML5
- CSS3
- JavaScript
- Web Storage API (`localStorage`)
- Web Crypto API para generar el código de despacho

No se utilizan frameworks ni dependencias externas.

## Cómo ejecutar el proyecto

No es necesario instalar dependencias ni ejecutar comandos.

1. Descarga o clona el repositorio:

   ```bash
   git clone https://github.com/bootcamp-uchile-2026/grupo-2-frontend.git
   ```

2. Entra en la carpeta del proyecto.
3. Abre el archivo `index.html` en un navegador web moderno.

La navegación hacia las demás vistas se realiza desde la propia aplicación.

> El carrito se guarda en el navegador. Para reiniciar sus datos se puede limpiar el almacenamiento local del sitio.

## Estructura del proyecto

```text
grupo-2-frontend/
├── index.html
├── carrito/
│   └── index.html
├── checkout/
│   └── index.html
├── productos/
│   └── moda-natural/
│       ├── index.html
│       └── producto/
│           └── index.html
├── css/
│   └── styles.css
├── js/
│   └── main.js
├── LICENSE
└── README.md
```

## Vistas principales

| Vista | Archivo | Descripción |
| --- | --- | --- |
| Inicio | `index.html` | Presentación de la tienda y acceso al catálogo. |
| Catálogo | `productos/moda-natural/index.html` | Productos, categorías, filtros y ordenamiento. |
| Producto | `productos/moda-natural/producto/index.html` | Detalle, variantes, cantidad y agregado al carrito. |
| Carrito | `carrito/index.html` | Gestión de productos e inicio del proceso de compra. |
| Checkout | `checkout/index.html` | Despacho, pago, resumen y confirmación. |

## Datos y comportamiento

Los productos, precios, reseñas y emprendedores son datos simulados para fines demostrativos. El flujo de autenticación y el pago también son simulaciones de interfaz: la aplicación no crea cuentas, no procesa pagos reales y no transmite información a servicios externos.

## Equipo Frontend

- Danitza Jara — Desarrollo Frontend
- Cristina Ortiz — Desarrollo Frontend
- Carlos Ortiz — Desarrollo Frontend

## Metodología de trabajo

El equipo utiliza GitFlow como estrategia de ramas:

- `main`: versiones estables y entregables.
- `develop`: integración del trabajo del equipo.
- `feature/*`: desarrollo de funcionalidades específicas.
- `release/*`: preparación y validación de una entrega.

Flujo previsto para el Hito 1:

```text
feature/* → develop → release/* → main → tag
```

Repositorio: [bootcamp-uchile-2026/grupo-2-frontend](https://github.com/bootcamp-uchile-2026/grupo-2-frontend)

Tablero del proyecto: [GitHub Project del Grupo 2](https://github.com/orgs/bootcamp-uchile-2026/projects/2/views/2)

## Diseño

La implementación se basa en los wireframes del flujo comprador entregados por el equipo UX/UI. Estos contemplan la página de inicio, catálogo, filtros, ordenamiento, detalle de producto, carrito lateral, carrito principal, acceso o compra como invitado y checkout.

## Alcance y limitaciones del Hito 1

- El contenido y las imágenes son demostrativos.
- No existe integración con una API o base de datos.
- El inicio de sesión y la creación de cuenta no autentican usuarios reales.
- El pago no realiza transacciones.
- El seguimiento se representa mediante un código de despacho generado localmente.

## Entrega

La versión presentada debe corresponder al commit y al tag publicados en la rama `main`. El nombre del tag y el hash del commit se incorporarán cuando se genere la versión definitiva del Hito 1.

Presentación programada para el **sábado 29 de agosto de 2026**.

## Licencia

Consulta el archivo [LICENSE](LICENSE) incluido en este repositorio.