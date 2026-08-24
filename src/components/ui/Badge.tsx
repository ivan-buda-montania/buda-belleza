import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

export type BadgeTone =
  'brand' | 'gold' | 'ink' | 'outline' | 'success' | 'warn' | 'glass' | 'onDark';

const toneStyles: Record<BadgeTone, string> = {
  brand: 'bg-brand-600 text-white',
  gold: 'bg-gold-300 text-gold-900',
  ink: 'bg-ink-900 text-white',
  outline: 'border border-ink-300 bg-surface/80 text-ink-700 backdrop-blur-sm',
  success: 'bg-success-100 text-success-700',
  warn: 'bg-warn-100 text-warn-700',
  glass: 'border border-white/25 bg-ink-900/45 text-white backdrop-blur-md',
  onDark: 'border border-white/15 bg-white/10 text-ink-100',
};

interface BadgeProps {
  children: ReactNode;
  tone?: BadgeTone;
  className?: string;
  /** Small leading dot — useful for stock/status badges. */
  dot?: boolean;
}

export function Badge({ children, tone = 'brand', className, dot = false }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-[0.6875rem] leading-none font-semibold tracking-[0.06em] uppercase',
        toneStyles[tone],
        className,
      )}
    >
      {dot && <span aria-hidden="true" className="h-1.5 w-1.5 rounded-full bg-current" />}
      {children}
    </span>
  );
}
