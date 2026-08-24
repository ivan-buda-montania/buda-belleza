import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

type EyebrowTone = 'brand' | 'gold' | 'muted' | 'onDark';

const toneStyles: Record<EyebrowTone, string> = {
  brand: 'text-brand-600',
  gold: 'text-gold-600',
  muted: 'text-ink-500',
  onDark: 'text-gold-300',
};

interface EyebrowProps {
  children: ReactNode;
  tone?: EyebrowTone;
  className?: string;
  /** Draw the short rule that precedes the label in editorial layouts. */
  rule?: boolean;
}

export function Eyebrow({ children, tone = 'brand', className, rule = true }: EyebrowProps) {
  return (
    <span className={cn('eyebrow inline-flex items-center gap-2.5', toneStyles[tone], className)}>
      {rule && <span aria-hidden="true" className="h-px w-6 bg-current opacity-50" />}
      {children}
    </span>
  );
}
