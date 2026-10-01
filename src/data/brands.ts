import type { Brand, WordmarkStyle } from '../types/brand';
import { catalogBrands, products } from './products';

/** Typographic treatments rotate so neighbouring wordmarks don't read as one repeated label. */
const WORDMARKS: WordmarkStyle[] = ['serif', 'spaced', 'italic', 'condensed', 'sans'];

/** The brand lines published in the catalog, with their real product counts. */
export const brands: Brand[] = catalogBrands.map((brand, index) => ({
  ...brand,
  wordmark: WORDMARKS[index % WORDMARKS.length],
  productCount: products.filter((product) => product.brandId === brand.id).length,
}));

export function getBrandById(id: string | undefined) {
  return id ? brands.find((brand) => brand.id === id) : undefined;
}
