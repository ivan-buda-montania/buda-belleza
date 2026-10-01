/**
 * What the public catalog publishes from the POS, and how it is organised.
 * Edit this file, then run `npm run catalog:build` to regenerate src/data/catalog.json.
 *
 * Patterns are matched against the product name upper-cased with accents removed, so
 * write them in that form ('COLAGENO', not 'Colágeno').
 */

import type { CategorySlug } from '../../src/types/category.ts';

export interface IncludeRule {
  patterns: string[];
  /** Set only when the pattern *is* the brand; other matches publish without a brand. */
  brand?: string;
}

/** A product is published when its name contains any pattern below. */
export const INCLUDE: IncludeRule[] = [
  { patterns: ['NUTRAPEL'], brand: 'Nutrapel' },
  { patterns: ['NEFERTITI'], brand: 'Nefertiti' },
  { patterns: ['VOGLIA'], brand: 'Voglia' },
  { patterns: ['KUUL'], brand: 'Kuul' },
  { patterns: ['VITTALE'], brand: 'Vittale' },
  { patterns: ['OURO'], brand: 'Ouro' },
  { patterns: ['HIDRO'] },
  { patterns: ['COLAGENO+QUERATINA', 'COLAGENO+KERATINA'] },
];

/**
 * First matching rule wins, so order matters: specific product types come before broad
 * words (a "SHAMPOO MATIZADOR" is hair care, not colour). Unmatched products go to 'otros';
 * fix individual products in category-overrides.json.
 */
export const CATEGORY_RULES: [CategorySlug, string[]][] = [
  ['cosmeticos', ['EYE PATCH', 'PESTANA', 'FACIAL', 'LABIO']],
  ['barberia', ['BARBA', 'BARBER', 'AFEITA', 'NAVAJA', 'SHAVE']],
  [
    'tintes',
    [
      'TINTE',
      ' TNTE ',
      'DECOLORANTE',
      ' DEC ',
      'PEROX',
      'OXIDANTE',
      'PLATINOXIDE',
      'REVELADOR',
      'MISTER COLOR',
      'COLOR OFF',
      'RETOCADOR',
      'ACLARANT',
      'FANTASIA',
      'FANTASY',
      ' FUNNY ',
    ],
  ],
  [
    'capilar',
    [
      'SHAMPOO',
      ' SH ',
      'ACONDICIONADOR',
      ' ACOND ',
      ' AMP ',
      ' AMP. ',
      'BIFASICO',
      'BISAFICO',
      '2 FASES',
      'BIOELIXIR',
      'MATIZADOR',
      'ALACIA',
      'ONDULANTE',
      ' PERM ',
      'FIJADOR',
      'FIJACION',
      ' MOUSE ',
      'KERACTIVE',
      'KERATIVE',
      'LASSIO',
      'PUNTAS',
      'ARGAN',
      'REPAIR',
      'FRIZZ',
      ' MASK ',
      ' MASC ',
      'RIZADOR',
      'MASCARILLA',
      'TRATAMIENTO',
      'TRAT ',
      'TRAT.',
      'KERATIN',
      'QUERATIN',
      'AMPOLLETA',
      'SERUM',
      'ACEITE',
      'CERA',
      'GEL',
      'SPRAY',
      'CREMA',
      'ALACIADOR',
      'BIFASE',
      'BI-FASE',
      'SEDA',
      'ANTIOXID',
      'PLEX',
      'LOCION',
      'TERMO',
      'ADITIVO',
      'SOBRE',
      'MOUSSE',
      'LEAVE',
      'RIZOS',
      'CAPILAR',
      'CABELLO',
    ],
  ],
  ['unas', ['UNAS', 'ESMALTE', 'NAIL']],
  ['accesorios', ['PEINE', 'CEPILLO', 'BROCHA', 'GORRA', 'GUANTE', ' CAPA ', 'TIJERA', 'ADORNO']],
];

/** How far back "Más vendido" looks, counted back from the last movement in the export. */
export const BESTSELLER_WINDOW_DAYS = 365;
/** How many products carry the "Más vendido" tag. */
export const BESTSELLER_COUNT = 12;
/** A product is "Nuevo" when its first inventory movement falls in this window. */
export const NEW_WINDOW_DAYS = 90;
