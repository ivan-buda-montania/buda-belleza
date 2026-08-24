/** Typographic treatment for the generated wordmark (no raster logo assets in the demo). */
export type WordmarkStyle = 'serif' | 'sans' | 'condensed' | 'spaced' | 'italic';

export interface Brand {
  id: string;
  name: string;
  wordmark: WordmarkStyle;
  /** Country of origin — a real trust signal for wholesale buyers. */
  origin: string;
  /** One-line positioning used on the brands page. */
  note: string;
  exclusive?: boolean;
  website?: string;
}
