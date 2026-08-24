import type { ElementType, ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type SectionTone = 'canvas' | 'surface' | 'sunken' | 'ink' | 'brand' | 'blush';

/**
 * A homepage section = a floating rounded panel on the canvas.
 * `tone` picks the surface; `bleed` opts out of the panel treatment for full-width bands.
 */
const toneStyles: Record<SectionTone, string> = {
  canvas: '',
  surface: 'bg-surface shadow-[var(--shadow-e1)] ring-1 ring-ink-900/[0.04]',
  sunken: 'bg-ink-100/70 ring-1 ring-ink-900/[0.04]',
  ink: 'bg-ink-950 text-ink-100 shadow-[var(--shadow-e3)]',
  brand: 'bg-brand-950 text-brand-50 shadow-[var(--shadow-e3)]',
  blush: 'bg-gradient-to-br from-brand-50 via-surface to-gold-50 ring-1 ring-brand-900/[0.05]',
};

interface SectionProps {
  children: ReactNode;
  tone?: SectionTone;
  className?: string;
  /** Inner padding preset. */
  padding?: 'none' | 'sm' | 'md' | 'lg';
  as?: ElementType;
  id?: string;
  'aria-labelledby'?: string;
}

const paddingStyles = {
  none: '',
  sm: 'py-10 sm:py-12',
  md: 'py-14 sm:py-18',
  lg: 'py-16 sm:py-24',
} as const;

export function Section({
  children,
  tone = 'canvas',
  className,
  padding = 'md',
  as: Component = 'section',
  ...rest
}: SectionProps) {
  const isPanel = tone !== 'canvas';

  return (
    <div className={cn('shell', isPanel && 'py-2')}>
      <Component
        className={cn(
          isPanel && 'rounded-panel-lg overflow-hidden',
          isPanel && paddingStyles[padding],
          isPanel && 'px-5 sm:px-8 lg:px-12',
          !isPanel && paddingStyles[padding],
          toneStyles[tone],
          className,
        )}
        {...rest}
      >
        {children}
      </Component>
    </div>
  );
}
