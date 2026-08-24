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
```

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
