import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';
import { Eyebrow } from './Eyebrow';
import { Reveal } from './Reveal';

interface SectionHeadingProps {
  eyebrow?: string;
  title: ReactNode;
  description?: ReactNode;
  /** Right-aligned action (link/button) on desktop; stacks under the copy on mobile. */
  action?: ReactNode;
  align?: 'left' | 'center';
  onDark?: boolean;
  className?: string;
  id?: string;
  /** Heading level for correct document outline. */
  as?: 'h1' | 'h2' | 'h3';
}

export function SectionHeading({
  eyebrow,
  title,
  description,
  action,
  align = 'left',
  onDark = false,
  className,
  id,
  as: Heading = 'h2',
}: SectionHeadingProps) {
  const centered = align === 'center';

  return (
    <div
      className={cn(
        'flex flex-col gap-6',
        centered ? 'items-center text-center' : 'md:flex-row md:items-end md:justify-between',
        className,
      )}
    >
      <Reveal className={cn('flex flex-col gap-3.5', centered ? 'items-center' : 'max-w-2xl')}>
        {eyebrow && <Eyebrow tone={onDark ? 'onDark' : 'brand'}>{eyebrow}</Eyebrow>}
        <Heading
          id={id}
          className={cn(
            'font-display text-display-lg font-medium',
            onDark ? 'text-white' : 'text-ink-900',
          )}
        >
          {title}
        </Heading>
        {description && (
          <p className={cn('text-lead', onDark ? 'text-ink-300' : 'text-ink-600')}>{description}</p>
        )}
      </Reveal>
      {action && (
        <Reveal delay={90} className={cn('shrink-0', centered && 'mt-1')}>
          {action}
        </Reveal>
      )}
    </div>
  );
}
