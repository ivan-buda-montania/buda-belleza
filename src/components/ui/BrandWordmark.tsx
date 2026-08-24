import { cn } from '../../lib/cn';
import type { Brand, WordmarkStyle } from '../../types/brand';

/**
 * The demo has no licensed logo files, so each brand renders as a typographic
 * wordmark. Five treatments keep the brand strip from reading as one repeated
 * label — swap this component for real SVG logos when assets are available.
 */
const wordmarkStyles: Record<WordmarkStyle, string> = {
  serif: 'font-display text-2xl font-medium tracking-[-0.01em]',
  sans: 'text-xl font-extrabold tracking-[-0.03em] uppercase',
  condensed: 'text-xl font-bold tracking-[-0.02em] uppercase [font-stretch:condensed]',
  spaced: 'text-base font-semibold tracking-[0.34em] uppercase',
  italic: 'font-display text-2xl font-medium italic tracking-[-0.01em]',
};

interface BrandWordmarkProps {
  brand: Brand;
  className?: string;
}

export function BrandWordmark({ brand, className }: BrandWordmarkProps) {
  return (
    <span className={cn('leading-none', wordmarkStyles[brand.wordmark], className)}>
      {brand.name}
    </span>
  );
}
