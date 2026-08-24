import { productImageId } from '../lib/images';
import type { CategorySlug } from '../types/category';
import type { Product, ProductTag, StockStatus } from '../types/product';
import { brands } from './brands';

interface ProductSeed {
  name: string;
  basePrice: number;
  presentation: string;
  unitsPerCase: number;
}

const productSeedsByCategory: Record<CategorySlug, ProductSeed[]> = {
  tintes: [
    {
      name: 'Tinte Permanente Cobertura Total',
      basePrice: 145,
      presentation: '60 ml',
      unitsPerCase: 12,
    },
    {
      name: 'Kit de Coloración Profesional',
      basePrice: 320,
      presentation: 'Kit 4 pzas',
      unitsPerCase: 6,
    },
    { name: 'Decolorante en Polvo Azul', basePrice: 210, presentation: '500 g', unitsPerCase: 12 },
    {
      name: 'Tinte Demi-Permanente Sin Amoniaco',
      basePrice: 165,
      presentation: '100 ml',
      unitsPerCase: 12,
    },
    { name: 'Oxidante en Crema 20 Vol', basePrice: 95, presentation: '900 ml', unitsPerCase: 12 },
    { name: 'Tinte Tono Sobre Tono', basePrice: 155, presentation: '60 ml', unitsPerCase: 12 },
    {
      name: 'Matizador Violeta Anti-Amarillo',
      basePrice: 180,
      presentation: '200 ml',
      unitsPerCase: 12,
    },
    { name: 'Tinte Fantasía Directo', basePrice: 175, presentation: '100 ml', unitsPerCase: 12 },
    {
      name: 'Kit de Mechas y Reflejos',
      basePrice: 290,
      presentation: 'Kit 6 pzas',
      unitsPerCase: 6,
    },
  ],
  capilar: [
    {
      name: 'Shampoo Reconstructor de Cabina',
      basePrice: 220,
      presentation: '1 L',
      unitsPerCase: 12,
    },
    {
      name: 'Mascarilla Hidratante Intensiva',
      basePrice: 260,
      presentation: '500 g',
      unitsPerCase: 12,
    },
    {
      name: 'Sérum Anti-Frizz Termoprotector',
      basePrice: 190,
      presentation: '60 ml',
      unitsPerCase: 24,
    },
    { name: 'Acondicionador Nutritivo', basePrice: 210, presentation: '1 L', unitsPerCase: 12 },
    {
      name: 'Ampolletas de Keratina',
      basePrice: 340,
      presentation: 'Caja 12 pzas',
      unitsPerCase: 6,
    },
    {
      name: 'Tratamiento de Alisado Sin Formol',
      basePrice: 480,
      presentation: '1 L',
      unitsPerCase: 6,
    },
    { name: 'Shampoo Anticaspa Zinc', basePrice: 195, presentation: '1 L', unitsPerCase: 12 },
    {
      name: 'Aceite Reparador de Puntas',
      basePrice: 150,
      presentation: '100 ml',
      unitsPerCase: 24,
    },
    { name: 'Botox Capilar Profesional', basePrice: 520, presentation: '1 kg', unitsPerCase: 6 },
  ],
  barberia: [
    {
      name: 'Máquina de Corte Inalámbrica',
      basePrice: 890,
      presentation: 'Pieza',
      unitsPerCase: 6,
    },
    {
      name: 'Navaja de Afeitar Profesional',
      basePrice: 310,
      presentation: 'Pieza',
      unitsPerCase: 12,
    },
    {
      name: 'Cera Moldeadora Mate para Barba',
      basePrice: 140,
      presentation: '100 g',
      unitsPerCase: 24,
    },
    { name: 'Capa de Corte Impermeable', basePrice: 175, presentation: 'Pieza', unitsPerCase: 12 },
    { name: 'Loción Post-Afeitado', basePrice: 130, presentation: '250 ml', unitsPerCase: 24 },
    {
      name: 'Peine de Carbono Antiestático',
      basePrice: 85,
      presentation: 'Pieza',
      unitsPerCase: 24,
    },
    {
      name: 'Aceite Acondicionador de Barba',
      basePrice: 160,
      presentation: '50 ml',
      unitsPerCase: 24,
    },
    { name: 'Trimmer de Precisión Cero', basePrice: 420, presentation: 'Pieza', unitsPerCase: 6 },
    {
      name: 'Navajas Desechables',
      basePrice: 195,
      presentation: 'Caja 100 pzas',
      unitsPerCase: 10,
    },
  ],
  unas: [
    {
      name: 'Esmalte en Gel Semipermanente',
      basePrice: 95,
      presentation: '15 ml',
      unitsPerCase: 24,
    },
    {
      name: 'Kit de Acrílico Completo',
      basePrice: 380,
      presentation: 'Kit 8 pzas',
      unitsPerCase: 6,
    },
    { name: 'Lámpara UV/LED 48 W', basePrice: 450, presentation: 'Pieza', unitsPerCase: 6 },
    {
      name: 'Removedor de Gel Acetona Pura',
      basePrice: 110,
      presentation: '500 ml',
      unitsPerCase: 12,
    },
    { name: 'Top Coat Brillo Espejo', basePrice: 90, presentation: '15 ml', unitsPerCase: 24 },
    {
      name: 'Set de Limas Profesionales',
      basePrice: 120,
      presentation: 'Set 10 pzas',
      unitsPerCase: 12,
    },
    {
      name: 'Base Fortalecedora con Calcio',
      basePrice: 95,
      presentation: '15 ml',
      unitsPerCase: 24,
    },
    { name: 'Polvo Acrílico Rosa Cover', basePrice: 210, presentation: '100 g', unitsPerCase: 12 },
    { name: 'Torno de Uñas 35 000 RPM', basePrice: 340, presentation: 'Pieza', unitsPerCase: 6 },
  ],
  accesorios: [
    {
      name: 'Set de Pinceles Profesionales',
      basePrice: 280,
      presentation: 'Set 12 pzas',
      unitsPerCase: 12,
    },
    {
      name: 'Guantes de Nitrilo Sin Polvo',
      basePrice: 165,
      presentation: 'Caja 100 pzas',
      unitsPerCase: 10,
    },
    {
      name: 'Capa para Tinte Reutilizable',
      basePrice: 120,
      presentation: 'Pieza',
      unitsPerCase: 12,
    },
    {
      name: 'Rodillos Profesionales',
      basePrice: 95,
      presentation: 'Set 12 pzas',
      unitsPerCase: 12,
    },
    {
      name: 'Pinzas Seccionadoras de Acero',
      basePrice: 110,
      presentation: 'Set 6 pzas',
      unitsPerCase: 12,
    },
    {
      name: 'Tazón y Brocha para Mezcla',
      basePrice: 75,
      presentation: 'Set 2 pzas',
      unitsPerCase: 24,
    },
    { name: 'Silla Hidráulica de Salón', basePrice: 1850, presentation: 'Pieza', unitsPerCase: 2 },
    { name: 'Carrito Organizador Rodante', basePrice: 950, presentation: 'Pieza', unitsPerCase: 4 },
    { name: 'Espejo de Salón con Marco', basePrice: 620, presentation: 'Pieza', unitsPerCase: 4 },
  ],
  cosmeticos: [
    { name: 'Base Líquida Acabado Mate', basePrice: 175, presentation: '30 ml', unitsPerCase: 24 },
    { name: 'Paleta de Sombras 18 Tonos', basePrice: 230, presentation: 'Pieza', unitsPerCase: 12 },
    { name: 'Labial Larga Duración', basePrice: 110, presentation: '4 g', unitsPerCase: 24 },
    { name: 'Corrector de Alta Cobertura', basePrice: 105, presentation: '8 ml', unitsPerCase: 24 },
    { name: 'Rubor en Polvo Compacto', basePrice: 95, presentation: '9 g', unitsPerCase: 24 },
    { name: 'Primer Facial Alisador', basePrice: 160, presentation: '30 ml', unitsPerCase: 24 },
    {
      name: 'Máscara de Pestañas Volumen',
      basePrice: 120,
      presentation: '10 ml',
      unitsPerCase: 24,
    },
    {
      name: 'Set de Brochas de Maquillaje',
      basePrice: 340,
      presentation: 'Set 15 pzas',
      unitsPerCase: 6,
    },
    {
      name: 'Delineador Líquido Waterproof',
      basePrice: 85,
      presentation: '2 ml',
      unitsPerCase: 24,
    },
  ],
};

/**
 * Brands are assigned per specialty: a nail-systems house should never end up on a
 * barber clipper. Indices map into the `brands` array declared in ./brands.
 */
const brandsByCategory: Record<CategorySlug, number[]> = {
  tintes: [5, 1, 0, 11],
  capilar: [0, 3, 10, 11],
  barberia: [9, 6, 4],
  unas: [7, 4, 2],
  accesorios: [4, 6, 7],
  cosmeticos: [2, 8, 10],
};

const tagCycle: ProductTag[][] = [
  ['bestseller'],
  ['new'],
  ['volume-offer'],
  ['bestseller', 'new'],
  ['new'],
  ['volume-offer'],
  ['bestseller'],
  ['new', 'volume-offer'],
  ['bestseller', 'volume-offer'],
];

const stockCycle: StockStatus[] = [
  'in-stock',
  'in-stock',
  'in-stock',
  'low-stock',
  'in-stock',
  'in-stock',
  'in-stock',
  'in-stock',
  'low-stock',
];

function buildProducts(): Product[] {
  const categorySlugs = Object.keys(productSeedsByCategory) as CategorySlug[];
  const products: Product[] = [];

  categorySlugs.forEach((categorySlug, categoryIndex) => {
    const seeds = productSeedsByCategory[categorySlug];
    seeds.forEach((seed, seedIndex) => {
      const pool = brandsByCategory[categorySlug];
      const brand = brands[pool[seedIndex % pool.length]];
      products.push({
        id: `${categorySlug}-${seedIndex + 1}`,
        sku: `BB-${categorySlug.slice(0, 3).toUpperCase()}-${String(seedIndex + 1).padStart(3, '0')}`,
        name: seed.name,
        brandId: brand.id,
        categorySlug,
        imageId: productImageId(categorySlug, seedIndex),
        price: {
          regular: seed.basePrice,
          wholesale: Math.round(seed.basePrice * 0.72),
          minWholesaleQty: 6,
        },
        presentation: seed.presentation,
        unitsPerCase: seed.unitsPerCase,
        tags: tagCycle[(seedIndex + categoryIndex) % tagCycle.length],
        stock: stockCycle[(seedIndex + categoryIndex * 3) % stockCycle.length],
      });
    });
  });

  return products;
}

export const products: Product[] = buildProducts();

export function getBestSellers() {
  return products.filter((product) => product.tags?.includes('bestseller'));
}

export function getNewArrivals() {
  return products.filter((product) => product.tags?.includes('new'));
}

export function getVolumeOffers() {
  return products.filter((product) => product.tags?.includes('volume-offer'));
}

export function getProductsByCategory(categorySlug: CategorySlug) {
  return products.filter((product) => product.categorySlug === categorySlug);
}
