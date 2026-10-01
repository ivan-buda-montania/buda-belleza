import { IMG } from '../lib/images';
import type { Category } from '../types/category';
import { getProductsByCategory } from './products';

const categoryDefinitions: Omit<Category, 'productCount'>[] = [
  {
    slug: 'tintes',
    name: 'Tintes y Color',
    tagline: 'Coloración profesional, del rubio técnico al fantasía',
    description:
      'Líneas completas de coloración permanente, demi y semi-permanente, decolorantes, oxidantes y matizadores. Cobertura total de la carta de color para salones que trabajan servicio técnico todos los días.',
    icon: 'Palette',
    imageId: IMG.catTintes,
    highlights: ['Permanente', 'Decoloración', 'Matizadores', 'Oxidantes'],
  },
  {
    slug: 'capilar',
    name: 'Tratamiento Capilar',
    tagline: 'Reconstrucción, hidratación y alisado de cabina',
    description:
      'Shampoos y acondicionadores de litro para uso intensivo en cabina, mascarillas, ampolletas, keratinas y sistemas de alisado con respaldo técnico y ficha de seguridad.',
    icon: 'Droplets',
    imageId: IMG.catCapilar,
    highlights: ['Litro cabina', 'Keratina', 'Botox capilar', 'Anticaída'],
  },
  {
    slug: 'barberia',
    name: 'Barbería',
    tagline: 'Máquinas, filos y cuidado de barba',
    description:
      'Todo el equipamiento de barbería: máquinas de corte y trimmers profesionales, navajas, capas, ceras, aceites y lociones post-afeitado de marcas con servicio y refacciones en México.',
    icon: 'Scissors',
    imageId: IMG.catBarberia,
    highlights: ['Máquinas', 'Navajas', 'Barba', 'Mobiliario'],
  },
  {
    slug: 'unas',
    name: 'Uñas',
    tagline: 'Gel, acrílico y equipo de cabina',
    description:
      'Sistemas de gel y acrílico completos, lámparas UV/LED, tornos, removedores y consumibles. Reposición constante para estudios de uñas con alta rotación.',
    icon: 'Sparkles',
    imageId: IMG.catUnas,
    highlights: ['Gel semipermanente', 'Acrílico', 'Lámparas', 'Consumibles'],
  },
  {
    slug: 'accesorios',
    name: 'Accesorios y Mobiliario',
    tagline: 'Equipa la cabina completa',
    description:
      'Desde pinceles, guantes y seccionadores hasta sillas hidráulicas, carritos y espejos. Equipamiento con garantía y entrega programada para aperturas y remodelaciones.',
    icon: 'ShoppingBag',
    imageId: IMG.catAccesorios,
    highlights: ['Herramienta', 'Desechables', 'Mobiliario', 'Textiles'],
  },
  {
    slug: 'cosmeticos',
    name: 'Cosméticos',
    tagline: 'Maquillaje profesional y cuidado facial',
    description:
      'Bases, correctores, paletas, labiales y brochas de grado profesional, más línea facial para servicios de spa. Tonos pensados para el mercado mexicano.',
    icon: 'Sparkle',
    imageId: IMG.catCosmeticos,
    highlights: ['Rostro', 'Ojos', 'Labios', 'Facial'],
  },
  {
    slug: 'otros',
    name: 'Otros productos',
    tagline: 'Complementos de las líneas que distribuimos',
    description:
      'Productos de nuestras marcas que no pertenecen a una especialidad de cabina: cuidado de pies, depilación, desinfección y kits.',
    icon: 'Package',
    imageId: IMG.warehouseLineup,
    highlights: [],
  },
];

/** Only categories with published products, counted from the POS catalog. */
export const categories: Category[] = categoryDefinitions
  .map((category) => ({ ...category, productCount: getProductsByCategory(category.slug).length }))
  .filter((category) => category.productCount > 0);

export function getCategoryBySlug(slug: string) {
  return categories.find((category) => category.slug === slug);
}
