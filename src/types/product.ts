import type { CategorySlug } from './category';

export type ProductTag = 'bestseller' | 'new' | 'volume-offer';
export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock';

export interface Price {
  regular: number;
  wholesale: number;
  minWholesaleQty?: number;
}

export interface Product {
  id: string;
  sku: string;
  name: string;
  brandId: string;
  categorySlug: CategorySlug;
  /** Unsplash id — resolve through `unsplashUrl` in `lib/images`. */
  imageId: string;
  price: Price;
  tags?: ProductTag[];
  stock: StockStatus;
  /** Units per master case — wholesale buyers order by case, not by piece. */
  unitsPerCase: number;
  presentation: string;
  description?: string;
}
