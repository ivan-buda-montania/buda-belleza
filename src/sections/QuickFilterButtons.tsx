import {
  useCallback,
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type KeyboardEvent,
} from 'react';
import { cn } from '../lib/cn';
import { formatInteger } from '../lib/format';

export type QuickFilter = 'bestseller' | 'new';

/** The panel this tablist controls — the caller must put this id on its `role="tabpanel"`. */
export const QUICK_FILTER_PANEL_ID = 'panel-productos';

/** Stable tab id so the panel can point back at the selected tab with `aria-labelledby`. */
export function quickFilterTabId(filter: QuickFilter) {
  return `filtro-${filter}`;
}

interface QuickFilterOption {
  id: QuickFilter;
  label: string;
}

const options: QuickFilterOption[] = [
  { id: 'bestseller', label: 'Más vendidos' },
  { id: 'new', label: 'Nuevos ingresos' },
];

interface QuickFilterButtonsProps {
  active: QuickFilter;
  onChange: (filter: QuickFilter) => void;
  counts?: Record<QuickFilter, number>;
  className?: string;
}

export function QuickFilterButtons({
  active,
  onChange,
  counts,
  className,
}: QuickFilterButtonsProps) {
  const scrollerRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLDivElement>(null);
  const tabRefs = useRef(new Map<QuickFilter, HTMLButtonElement>());
  const [indicator, setIndicator] = useState<{ x: number; width: number } | null>(null);
  const [animated, setAnimated] = useState(false);

  const measure = useCallback(() => {
    const node = tabRefs.current.get(active);
    if (!node) return;
    setIndicator({ x: node.offsetLeft, width: node.offsetWidth });
  }, [active]);

  useLayoutEffect(() => {
    measure();
    if (typeof ResizeObserver === 'undefined') return;

    const observer = new ResizeObserver(measure);
    if (listRef.current) observer.observe(listRef.current);
    tabRefs.current.forEach((node) => observer.observe(node));
    return () => observer.disconnect();
  }, [measure]);

  // The pill lands in place on first paint; only later selections are worth animating.
  useEffect(() => {
    if (!indicator || animated) return;
    const frame = requestAnimationFrame(() => setAnimated(true));
    return () => cancelAnimationFrame(frame);
  }, [indicator, animated]);

  // Keep the selection inside the mobile scroller without ever scrolling the page.
  useEffect(() => {
    const scroller = scrollerRef.current;
    const node = tabRefs.current.get(active);
    if (!scroller || !node) return;

    const scrollerBox = scroller.getBoundingClientRect();
    const nodeBox = node.getBoundingClientRect();
    const overflowStart = nodeBox.left - scrollerBox.left - 12;
    const overflowEnd = nodeBox.right - scrollerBox.right + 12;
    const delta = overflowStart < 0 ? overflowStart : overflowEnd > 0 ? overflowEnd : 0;
    if (delta === 0) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    scroller.scrollBy({ left: delta, behavior: reduced ? 'auto' : 'smooth' });
  }, [active]);

  function handleKeyDown(event: KeyboardEvent<HTMLButtonElement>) {
    const current = options.findIndex((option) => option.id === active);
    let next = current;

    if (event.key === 'ArrowRight') next = (current + 1) % options.length;
    else if (event.key === 'ArrowLeft') next = (current - 1 + options.length) % options.length;
    else if (event.key === 'Home') next = 0;
    else if (event.key === 'End') next = options.length - 1;
    else return;

    event.preventDefault();
    onChange(options[next].id);
    tabRefs.current.get(options[next].id)?.focus();
  }

  return (
    <div
      ref={scrollerRef}
      className={cn('no-scrollbar -mx-1.5 -my-2 max-w-full overflow-x-auto px-1.5 py-2', className)}
    >
      <div
        ref={listRef}
        role="tablist"
        aria-label="Filtros rápidos"
        className="bg-ink-100/70 ring-ink-900/[0.05] relative inline-flex items-center gap-1 rounded-full p-1 ring-1"
      >
        <span
          aria-hidden="true"
          className="bg-brand-600 pointer-events-none absolute top-1 bottom-1 left-0 rounded-full shadow-[var(--shadow-brand)] duration-[320ms] ease-[var(--ease-out-quint)]"
          style={{
            transform: `translateX(${indicator?.x ?? 0}px)`,
            width: indicator?.width ?? 0,
            opacity: indicator ? 1 : 0,
            transitionProperty: animated ? 'transform, width, opacity' : 'opacity',
          }}
        />

        {options.map((option) => {
          const isActive = option.id === active;
          const count = counts?.[option.id];

          return (
            <button
              key={option.id}
              ref={(node) => {
                if (node) tabRefs.current.set(option.id, node);
                else tabRefs.current.delete(option.id);
              }}
              type="button"
              role="tab"
              id={quickFilterTabId(option.id)}
              aria-selected={isActive}
              aria-controls={QUICK_FILTER_PANEL_ID}
              tabIndex={isActive ? 0 : -1}
              onClick={() => onChange(option.id)}
              onKeyDown={handleKeyDown}
              className={cn(
                'relative z-10 inline-flex h-11 items-center gap-1.5 rounded-full px-4 text-sm font-semibold whitespace-nowrap transition-colors duration-250 ease-[var(--ease-out-quint)] sm:px-5',
                isActive ? 'text-white' : 'text-ink-600 hover:text-ink-900',
              )}
            >
              {option.label}
              {count !== undefined && (
                <>
                  <span
                    aria-hidden="true"
                    className={cn(
                      '-translate-y-[0.45em] rounded-full px-1.5 py-0.5 text-[0.625rem] leading-none font-bold tabular-nums transition-colors duration-250 ease-[var(--ease-out-quint)]',
                      isActive ? 'bg-white/20 text-white' : 'bg-ink-900/[0.06] text-ink-600',
                    )}
                  >
                    {formatInteger(count)}
                  </span>
                  <span className="sr-only">({formatInteger(count)} referencias)</span>
                </>
              )}
            </button>
          );
        })}
      </div>
    </div>
  );
}
