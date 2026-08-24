import type { ElementType, ReactNode } from 'react';
import { cn } from '../../lib/cn';

/**
 * @deprecated Kept as a thin alias so older imports keep compiling.
 * Use `Section` for new work — it carries the tone/padding contract.
 */
type SectionPanelVariant = 'light' | 'tinted' | 'dark' | 'plain';

const variantStyles: Record<SectionPanelVariant, string> = {
  light: 'bg-surface shadow-[var(--shadow-e1)]',
  tinted: 'bg-gradient-to-br from-brand-50 to-surface shadow-[var(--shadow-e1)]',
  dark: 'bg-ink-950 text-ink-100',
  plain: '',
};

interface SectionPanelProps {
  children: ReactNode;
  variant?: SectionPanelVariant;
  className?: string;
  as?: ElementType;
}

export function SectionPanel({
  children,
  variant = 'light',
  className,
  as: Component = 'section',
}: SectionPanelProps) {
  return (
    <Component
      className={cn(
        'shell',
        variant !== 'plain' && 'rounded-panel-lg py-12 sm:py-16',
        variantStyles[variant],
        className,
      )}
    >
      {children}
    </Component>
  );
}
