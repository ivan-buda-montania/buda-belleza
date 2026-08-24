import { IMG } from '../lib/images';
import type { Banner } from '../types/banner';

export const banners: Banner[] = [
  {
    id: 'banner-color',
    imageId: IMG.heroColor,
    eyebrow: 'Temporada Otoño · Coloración',
    headline: 'La carta de color completa, a precio mayorista',
    accentWord: 'completa',
    subcopy:
      'Más de 940 referencias de coloración, decoloración y matizado disponibles para entrega inmediata en toda la República.',
    ctaPrimary: { label: 'Ver catálogo mayorista', href: '/catalogo' },
    ctaSecondary: { label: 'Solicitar lista de precios', href: '/mayoristas' },
    note: 'Descuento por volumen desde 6 piezas',
  },
  {
    id: 'banner-barberia',
    imageId: IMG.heroBarber,
    eyebrow: 'Equipamiento · Barbería',
    headline: 'Abre tu barbería con un solo proveedor',
    accentWord: 'un solo',
    subcopy:
      'Máquinas, mobiliario, consumibles y línea de barba de marcas con servicio y refacciones en México. Asesoría de apertura incluida.',
    ctaPrimary: { label: 'Ver equipamiento', href: '/categoria/barberia' },
    ctaSecondary: { label: 'Hablar con un asesor', href: '/contacto' },
    note: 'Paquetes de apertura a 3 y 6 meses',
  },
  {
    id: 'banner-volumen',
    imageId: IMG.heroCosmetics,
    eyebrow: 'Programa mayorista',
    headline: 'Precios de distribuidor desde tu primer pedido',
    accentWord: 'distribuidor',
    subcopy:
      'Registra tu salón, barbería o estudio y accede a la lista mayorista, crédito a 30 días y un asesor asignado.',
    ctaPrimary: { label: 'Registrarme como mayorista', href: '/mayoristas' },
    ctaSecondary: { label: 'Conocer las marcas', href: '/marcas' },
    note: 'Alta validada en menos de 24 horas hábiles',
  },
];
