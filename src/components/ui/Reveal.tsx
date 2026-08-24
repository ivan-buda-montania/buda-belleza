import {
  useEffect,
  useRef,
  useState,
  type CSSProperties,
  type ElementType,
  type ReactNode,
} from 'react';
import { cn } from '../../lib/cn';

interface RevealProps {
  children: ReactNode;
  /** Milliseconds of delay before this element animates in. */
  delay?: number;
  /** Vertical travel distance in px. Use 0 for a pure fade. */
  y?: number;
  /** Starting scale, e.g. 0.96 for a gentle zoom-in. */
  scale?: number;
  className?: string;
  as?: ElementType;
  /** Reveal once and stay revealed (default) or re-animate on every entry. */
  once?: boolean;
  /** Anchor target / `aria-labelledby` reference for the rendered element. */
  id?: string;
}

/**
 * Scroll-reveal primitive built on IntersectionObserver — no animation library.
 * The visual transition lives in the `reveal` utility (theme.css), which is fully
 * neutralised under `prefers-reduced-motion: reduce`.
 */
export function Reveal({
  children,
  delay = 0,
  y = 18,
  scale,
  className,
  as: Component = 'div',
  once = true,
  id,
}: RevealProps) {
  const ref = useRef<HTMLElement>(null);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    const node = ref.current;
    if (!node) return;

    if (typeof IntersectionObserver === 'undefined') {
      setRevealed(true);
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            setRevealed(true);
            if (once) observer.unobserve(entry.target);
          } else if (!once) {
            setRevealed(false);
          }
        }
      },
      { rootMargin: '0px 0px -8% 0px', threshold: 0.12 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [once]);

  return (
    <Component
      ref={ref}
      id={id}
      className={cn('reveal', className)}
      data-revealed={revealed}
      style={
        {
          '--reveal-delay': `${delay}ms`,
          '--reveal-y': `${y}px`,
          ...(scale ? { '--reveal-s': scale } : {}),
        } as CSSProperties
      }
    >
      {children}
    </Component>
  );
}
