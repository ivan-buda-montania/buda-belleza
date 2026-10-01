# Buda Belleza

Sitio institucional y catálogo mayorista de **Buda Belleza**, distribuidor de productos de
belleza profesional en México: tintes, tratamiento capilar, barbería, uñas, accesorios y
cosméticos para salones, barberías y estudios.

## Stack

| Área           | Herramienta                                                 |
| -------------- | ----------------------------------------------------------- |
| Build          | Vite 8                                                      |
| UI             | React 19 + TypeScript                                       |
| Estilos        | Tailwind CSS v4 (CSS-first `@theme`, sin `tailwind.config`) |
| Ruteo          | react-router-dom 7                                          |
| Carruseles     | embla-carousel-react                                        |
| Iconos         | lucide-react                                                |
| Lint / formato | oxlint + Prettier                                           |

## Comandos

```bash
npm install
npm run dev           # servidor de desarrollo
npm run build         # tsc -b && vite build
npm run preview       # sirve el build de producción
npm run lint          # oxlint
npm run format        # prettier --write .
npm run db:import -- /ruta/Database.fdb   # importa el punto de venta a db/eleventa.sqlite
npm run db:ui                             # panel y explorador local en http://127.0.0.1:5180
npm run catalog:images                    # busca fotos oficiales de producto (public/products)
npm run catalog:build                     # regenera src/data/catalog.json desde la base local
```

## Datos del punto de venta (eleventa)

`npm run db:import` copia la base Firebird 2.5 de eleventa (`.fdb`) a SQLite en
`db/eleventa.sqlite`. Requiere Docker: levanta un contenedor temporal de Firebird sobre una
copia del archivo, así que el original nunca se abre. Cada ejecución reconstruye el archivo.

- Tablas `raw_*` — espejo de cada tabla de eleventa con sus nombres originales (sin la
  contraseña de usuarios).
- Vistas `products`, `inventory_movements`, `departments` — definidas en `db/views.sql`.
- `import_run` / `import_tables` — archivo de origen, su SHA-256 y filas por tabla.

`npm run db:ui` abre un panel de solo lectura (gráficas por periodo) y un explorador de tablas con
búsqueda, orden y paginación. Escucha solo en `127.0.0.1`; no lo expongas a la red.

`db/eleventa.sqlite` está en `.gitignore`: contiene costos y datos internos y este repositorio
es público. No lo subas.

## Catálogo del sitio

El catálogo público sale del punto de venta, no de datos de ejemplo. `npm run catalog:build` lee
`db/eleventa.sqlite` y escribe `src/data/catalog.json`, que sí se versiona para que Vercel pueda
construir el sitio sin la base. Solo contiene clave, nombre, marca, categoría y etiquetas: sin
precios, costos ni volúmenes de venta.

- **Qué se publica, marcas y categorías** — `scripts/catalog/config.ts` (palabras clave en el
  nombre del producto).
- **Correcciones de categoría por producto** — `scripts/catalog/category-overrides.json`
  (`"clave": "categoria"`).
- **Etiquetas** — "Más vendido": las 12 claves con más salidas en los últimos 12 meses.
  "Nuevo": primer movimiento en los últimos 90 días. Ambas se cuentan hacia atrás desde el último
  movimiento de la exportación.

- **Fotos** — `npm run catalog:images` busca fotos primero en los sitios oficiales de cada marca
  (nefertiti.com.mx, tienda.nutrapel.com, vittale.com, vogliacolor.com, vogliahombre.com,
  ouro.com.mx, kuulcolor.com.mx) y, para lo que no aparece ahí, en tiendas de belleza mexicanas con
  catálogo Shopify (lista en `scripts/catalog/images.ts`). Una foto de tienda solo se propone con
  coincidencia ≥ 0.85, y tonos de tinte y volúmenes de peróxido deben coincidir exactamente. Cada
  propuesta queda en `scripts/catalog/product-images.json` como `"auto"`; revísala y cámbiala a
  `"approved"` (se publica), `"rejected"` (esa foto no; se buscará otra) o `"none"` (no volver a
  buscar). **Solo las aprobadas se publican.** Las fotos se guardan en `public/products/`; un
  producto sin foto muestra el ícono de su categoría.

Para actualizar: `npm run db:import -- /ruta/Database.fdb`, luego `npm run catalog:images` (si hay
productos nuevos), `npm run catalog:build`, revisa el diff de `catalog.json` y haz commit.

## Sistema de diseño — "Editorial Atelier"

Todo el sistema vive en `src/styles/theme.css` como tokens de Tailwind v4. **No se escriben
valores crudos (hex, px de sombra, curvas de easing) en los componentes.**

- **Tipografía** — Playfair Display para display (`font-display`), Inter para UI (`font-sans`).
  Escala fluida con `clamp()`: `text-display-2xl … text-display-sm`, `text-lead`, `text-eyebrow`.
- **Color** — `brand-*` (magenta couture), `gold-*` (champaña), `ink-*` (piedra cálida → negro),
  más `success/warn/danger`. Alias semánticos: `bg-canvas`, `bg-surface`, `border-line`.
- **Forma** — `rounded-card | rounded-panel | rounded-panel-lg | rounded-hero`.
- **Elevación** — cuatro niveles `--shadow-e1` … `--shadow-e4`, más `--shadow-brand` y `--shadow-gold`.
- **Movimiento** — `--ease-out-quint` (por defecto), `--ease-out-expo`, `--ease-spring`;
  animaciones `animate-marquee`, `animate-ken-burns`, `animate-float`, `animate-fade-up`.
- **Utilidades propias** — `shell` (contenedor), `eyebrow`, `grain`, `edge-fade-x`,
  `rule-fade`, `text-gradient-brand`, `text-gradient-gold`, `no-scrollbar`, `reveal`.

Todo el movimiento respeta `prefers-reduced-motion` de forma global.

## Estructura

```
src/
├─ components/
│  ├─ ui/          primitivas del sistema (Section, Button, Badge, Reveal, SmartImage…)
│  ├─ layout/      navbar, footer, barra de anuncios, acciones flotantes
│  ├─ product/     tarjeta y grid de producto
│  ├─ catalog/     panel de filtros
│  ├─ carousel/    carrusel accesible sobre embla
│  ├─ quote/       cajón de cotización
│  ├─ forms/       campos de formulario
│  └─ icons/       glifos de marca y mapas de iconos
├─ sections/       secciones de la home
├─ pages/          rutas
├─ data/           contenido de demostración (catálogo, marcas, institucional)
├─ context/        estado de la cotización (persistido en localStorage)
├─ lib/            utilidades (formato MXN, imágenes, cn)
└─ styles/         theme.css — el sistema de diseño
```

## Cotización, no carrito

El comprador mayorista arma una **cotización**, no una compra. `src/context/` mantiene las
líneas en `localStorage`, calcula subtotal y ahorro contra precio de lista, valida el pedido
mínimo y genera un mensaje de WhatsApp con SKU × cantidad.

## Antes de producción

- Las fotografías son de Unsplash y se resuelven por id en `src/lib/images.ts`.
  Sustituir por fotografía propia cambiando únicamente ese archivo.
- Las marcas se dibujan como logotipos tipográficos (`BrandWordmark`) porque el demo no
  incluye archivos de logo licenciados.
- Los glifos sociales en `src/components/icons/SocialIcons.tsx` son originales simplificados;
  reemplazar por los assets oficiales de cada plataforma.
- `src/data/` es contenido de demostración: catálogo, precios, sucursales y testimonios deben
  reemplazarse con datos reales antes de publicar.
# buda-belleza
