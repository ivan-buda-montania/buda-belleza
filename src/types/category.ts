export type CategorySlug =
  'tintes' | 'capilar' | 'barberia' | 'unas' | 'accesorios' | 'cosmeticos' | 'otros';

export interface Category {
  slug: CategorySlug;
  name: string;
  /** Short editorial line used on category cards and category landing pages. */
  tagline: string;
  /** Longer institutional copy for the category hero. */
  description: string;
  icon: string;
  /** Unsplash id — resolve through `unsplashUrl` in `lib/images`. */
  imageId: string;
  /** Representative sub-lines shown as chips. */
  highlights: string[];
  /** Published products in this category, counted from the catalog. */
  productCount: number;
}
