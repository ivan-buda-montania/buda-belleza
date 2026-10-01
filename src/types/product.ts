// Explicit extension: this file is also type-checked from scripts/ under Node's resolution.
import type { CategorySlug } from './category.ts';

/** Both tags are derived from real POS movements by `npm run catalog:build`. */
export type ProductTag = 'bestseller' | 'new';

/** One product as written to src/data/catalog.json. */
export interface CatalogProduct {
  /** eleventa product code (barcode or store code). */
  id: string;
  name: string;
  brandId?: string;
  categorySlug: CategorySlug;
  tags?: ProductTag[];
  /** Date of the product's first inventory movement (YYYY-MM-DD). */
  firstSeen?: string;
  /** 1 = most units sold in the bestseller window; only set on bestsellers. */
  salesRank?: number;
  /** Official product photo served from public/, e.g. "/products/ab12cd34ef56.webp". */
  image?: string;
}

export interface CatalogFile {
  source: { lastMovementAt: string };
  brands: { id: string; name: string }[];
  products: CatalogProduct[];
}

export interface Product extends CatalogProduct {
  /** Code shown to buyers and sent in quote requests — the POS code itself. */
  sku: string;
}
