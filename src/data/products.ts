import type { CategorySlug } from '../types/category';
import type { CatalogFile, Product } from '../types/product';
import catalogJson from './catalog.json';

/**
 * The published catalog, generated from the store's POS by `npm run catalog:build`.
 * Do not edit catalog.json by hand — change scripts/catalog/config.ts and rebuild.
 */
const catalog = catalogJson as CatalogFile;

export const catalogSource = catalog.source;
export const catalogBrands = catalog.brands;

export const products: Product[] = catalog.products.map((product) => ({
  ...product,
  sku: product.id,
}));

/** Ordered by units sold in the bestseller window, best first. */
export function getBestSellers() {
  return products
    .filter((product) => product.salesRank !== undefined)
    .sort((a, b) => (a.salesRank ?? 0) - (b.salesRank ?? 0));
}

/** Most recent first appearance in the POS first. */
export function getNewArrivals() {
  return products
    .filter((product) => product.tags?.includes('new'))
    .sort((a, b) => (b.firstSeen ?? '').localeCompare(a.firstSeen ?? ''));
}

export function getProductsByCategory(categorySlug: CategorySlug) {
  return products.filter((product) => product.categorySlug === categorySlug);
}
