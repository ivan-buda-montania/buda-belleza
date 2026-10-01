/** Typographic treatment for the generated wordmark (no raster logo assets yet). */
export type WordmarkStyle = 'serif' | 'sans' | 'condensed' | 'spaced' | 'italic';

export interface Brand {
  id: string;
  name: string;
  wordmark: WordmarkStyle;
  /** Published products carrying this brand. */
  productCount: number;
}
