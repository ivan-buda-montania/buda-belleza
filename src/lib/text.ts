import { getBrandById } from '../data/brands';
import { getCategoryBySlug } from '../data/categories';
import { products } from '../data/products';
import type { Product } from '../types/product';

/** Accent-insensitive comparison: «Fantasía» must match a typed "fantasia". */
export function normalizeText(value: string) {
  return value.normalize('NFD').replace(/[̀-ͯ]/g, '').toLowerCase();
}

/**
 * One search index shared by the navbar autocomplete and the catalog, so both
 * resolve the same query the same way.
 */
const searchIndex = new Map<string, string>();
for (const product of products) {
  const haystack = [
    product.name,
    product.sku,
    getBrandById(product.brandId)?.name ?? '',
    getCategoryBySlug(product.categorySlug)?.name ?? '',
  ].join(' ');
  searchIndex.set(product.id, normalizeText(haystack));
}

/** `term` must already be normalized via `normalizeText`. */
export function productMatches(product: Product, term: string) {
  if (!term) return true;
  return (searchIndex.get(product.id) ?? '').includes(term);
}
