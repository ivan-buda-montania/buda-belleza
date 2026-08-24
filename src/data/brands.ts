import type { Brand, WordmarkStyle } from '../types/brand';

interface BrandSeed {
  name: string;
  wordmark: WordmarkStyle;
  origin: string;
  note: string;
  exclusive?: boolean;
}

const brandSeeds: BrandSeed[] = [
  {
    name: 'Kerastin',
    wordmark: 'serif',
    origin: 'Francia',
    note: 'Reconstrucción capilar de cabina con tecnología de aminoácidos.',
    exclusive: true,
  },
  {
    name: 'Luxor Pro',
    wordmark: 'spaced',
    origin: 'Italia',
    note: 'Coloración permanente con carta de 120 tonos y cobertura de canas.',
  },
  {
    name: 'Bellara',
    wordmark: 'italic',
    origin: 'España',
    note: 'Cosmética profesional de rostro y ojos para servicio de novia.',
  },
  {
    name: 'Nortiv Hair',
    wordmark: 'condensed',
    origin: 'Estados Unidos',
    note: 'Cuidado capilar de alto rendimiento en presentación de litro.',
  },
  {
    name: 'Studio One',
    wordmark: 'sans',
    origin: 'México',
    note: 'Herramienta y mobiliario de salón con garantía nacional.',
  },
  {
    name: 'ColorLab MX',
    wordmark: 'serif',
    origin: 'México',
    note: 'Laboratorio mexicano de color y decoloración técnica.',
    exclusive: true,
  },
  {
    name: 'Vantiq',
    wordmark: 'condensed',
    origin: 'Alemania',
    note: 'Máquinas de corte y trimmers con servicio y refacciones locales.',
    exclusive: true,
  },
  {
    name: 'Pulcra',
    wordmark: 'spaced',
    origin: 'Italia',
    note: 'Sistemas de gel y acrílico para estudios de uñas.',
  },
  {
    name: 'Serenna',
    wordmark: 'italic',
    origin: 'Corea del Sur',
    note: 'Línea facial y de spa con activos dermatológicos.',
    exclusive: true,
  },
  {
    name: 'Nova Barber',
    wordmark: 'sans',
    origin: 'Estados Unidos',
    note: 'Cuidado de barba, ceras y lociones post-afeitado.',
  },
  {
    name: 'Ámbar Studio',
    wordmark: 'serif',
    origin: 'México',
    note: 'Aceites y tratamientos botánicos formulados en Guadalajara.',
    exclusive: true,
  },
  {
    name: 'Prisma Lab',
    wordmark: 'condensed',
    origin: 'Brasil',
    note: 'Alisados y tratamientos de keratina sin formol.',
    exclusive: true,
  },
];

export const brands: Brand[] = brandSeeds.map((seed, index) => ({
  id: `brand-${index + 1}`,
  ...seed,
}));

export function getBrandById(id: string) {
  return brands.find((brand) => brand.id === id);
}

export const exclusiveBrands = brands.filter((brand) => brand.exclusive);
