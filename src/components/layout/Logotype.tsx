import { useId } from 'react';
import { cn } from '../../lib/cn';

interface LogotypeProps {
  className?: string;
  variant?: 'ink' | 'light';
}

/**
 * The mark is a single nonzero-wound path: stem + two pointed petal bowls, with the
 * counters drawn in the opposite direction so they punch through as holes.
 */
const MARK_PATH = [
  'M8.6 4h4.6v32H8.6a4.6 4.6 0 0 1-4.6-4.6V8.6A4.6 4.6 0 0 1 8.6 4Z',
  'M13 4H18.6Q29.2 5.2 30.2 11.6Q29.2 18 18.6 19.2H13Z',
  'M13 19.2H20.4Q32.6 20.6 33.6 27.6Q32.6 34.6 20.4 36H13Z',
  'M13.2 8.4V15.8H18.6Q25.6 15 26.6 12.1Q25.6 9.2 18.6 8.4Z',
  'M13.2 22.4V32.4H20.4Q28.8 31.4 30 27.4Q28.8 23.4 20.4 22.4Z',
].join(' ');

export function Logotype({ className, variant = 'ink' }: LogotypeProps) {
  const rawId = useId();
  const gradientId = `bb-mark-${rawId.replace(/[^a-zA-Z0-9-]/g, '')}`;
  const onDark = variant === 'light';

  return (
    <span className={cn('inline-flex items-center gap-2.5 leading-none', className)}>
      <svg viewBox="1.8 3 34 34" className="h-8 w-8 shrink-0" aria-hidden="true" focusable="false">
        <defs>
          <linearGradient
            id={gradientId}
            x1="4"
            y1="4"
            x2="34"
            y2="36"
            gradientUnits="userSpaceOnUse"
          >
            <stop offset="0%" stopColor="var(--color-brand-700)" />
            <stop offset="48%" stopColor="var(--color-brand-500)" />
            <stop offset="100%" stopColor="var(--color-gold-400)" />
          </linearGradient>
        </defs>
        <path d={MARK_PATH} fill={`url(#${gradientId})`} />
      </svg>

      <span className="flex flex-col">
        <span
          className={cn(
            'font-display text-[1.3125rem] leading-[0.95] font-medium tracking-[0.015em]',
            onDark ? 'text-white' : 'text-ink-900',
          )}
        >
          BUDA
        </span>
        <span
          className={cn(
            // The trailing letter-space would push the block off-centre without the negative margin.
            'mt-[0.42em] -mr-[0.34em] text-[0.5rem] leading-none font-semibold tracking-[0.34em] uppercase',
            onDark ? 'text-gold-300' : 'text-brand-600',
          )}
        >
          Belleza
        </span>
      </span>
    </span>
  );
}
