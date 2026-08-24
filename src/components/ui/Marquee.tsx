import type { ReactNode } from 'react';
import { cn } from '../../lib/cn';

interface MarqueeProps {
  children: ReactNode;
  /** Duplicated automatically for the seamless loop — pass one copy only. */
  className?: string;
  speed?: 'normal' | 'slow';
  gapClassName?: string;
  reverse?: boolean;
}

export function Marquee({
  children,
  className,
  speed = 'normal',
  gapClassName = 'gap-14',
  reverse = false,
}: MarqueeProps) {
  const track = (
    <div className={cn('flex shrink-0 items-center', gapClassName)} aria-hidden={undefined}>
      {children}
    </div>
  );

  return (
    <div className={cn('group edge-fade-x overflow-hidden', className)}>
      <div
        className={cn(
          'flex w-max',
          gapClassName,
          speed === 'slow' ? 'animate-marquee-slow' : 'animate-marquee',
          reverse && '[animation-direction:reverse]',
          'group-hover:[animation-play-state:paused]',
        )}
      >
        {track}
        <div className={cn('flex shrink-0 items-center', gapClassName)} aria-hidden="true">
          {children}
        </div>
      </div>
    </div>
  );
}
