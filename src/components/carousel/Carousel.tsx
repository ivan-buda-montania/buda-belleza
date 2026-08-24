import type { EmblaOptionsType } from 'embla-carousel';
import useEmblaCarousel from 'embla-carousel-react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useCallback, useEffect, useRef, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface CarouselControls {
  scrollPrev: () => void;
  scrollNext: () => void;
  canScrollPrev: boolean;
  canScrollNext: boolean;
  selectedIndex: number;
  slideCount: number;
}

interface CarouselProps {
  children: ReactNode[];
  slideClassName?: string;
  showDots?: boolean;
  showProgress?: boolean;
  /** Advance interval in ms. 0 or undefined disables autoplay. */
  autoplay?: number;
  ariaLabel: string;
  controlsPlacement?: 'overlay' | 'outside' | 'header' | 'corner';
  /** Used with `controlsPlacement="header"` or `"corner"` — lets the caller compose the controls. */
  renderControls?: (api: CarouselControls) => ReactNode;
  className?: string;
  options?: EmblaOptionsType;
}

function NavButton({
  label,
  onClick,
  disabled,
  className,
  children,
}: {
  label: string;
  onClick: () => void;
  disabled: boolean;
  className?: string;
  children: ReactNode;
}) {
  // `aria-disabled` rather than `disabled`: reaching the last slide with the keyboard must
  // not blur the arrow the user is standing on.
  return (
    <button
      type="button"
      onClick={() => {
        if (!disabled) onClick();
      }}
      aria-disabled={disabled}
      aria-label={label}
      className={cn(
        'bg-surface text-brand-600 ring-ink-900/[0.06] flex h-11 w-11 cursor-pointer items-center justify-center',
        'rounded-full shadow-[var(--shadow-e2)] ring-1',
        'transition-[background-color,color,scale,box-shadow] duration-250 ease-[var(--ease-out-quint)]',
        'hover:bg-brand-600 hover:text-white hover:shadow-[var(--shadow-brand)] active:scale-95',
        'aria-disabled:pointer-events-none aria-disabled:opacity-30 aria-disabled:shadow-none',
        className,
      )}
    >
      {children}
    </button>
  );
}

export function Carousel({
  children,
  slideClassName,
  showDots = false,
  showProgress = false,
  autoplay,
  ariaLabel,
  controlsPlacement = 'overlay',
  renderControls,
  className,
  options,
}: CarouselProps) {
  const [emblaRef, emblaApi] = useEmblaCarousel({ align: 'start', ...options });
  const rootRef = useRef<HTMLDivElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);

  const [selectedIndex, setSelectedIndex] = useState(0);
  const [scrollSnaps, setScrollSnaps] = useState<number[]>([]);
  const [canScrollPrev, setCanScrollPrev] = useState(false);
  const [canScrollNext, setCanScrollNext] = useState(children.length > 1);
  const [hasOverflow, setHasOverflow] = useState(children.length > 1);
  const [slidesPeek, setSlidesPeek] = useState(false);

  const scrollPrev = useCallback(() => emblaApi?.scrollPrev(), [emblaApi]);
  const scrollNext = useCallback(() => emblaApi?.scrollNext(), [emblaApi]);

  useEffect(() => {
    if (!emblaApi) return;

    const syncState = () => {
      const snaps = emblaApi.scrollSnapList();
      setScrollSnaps(snaps);
      setSelectedIndex(emblaApi.selectedScrollSnap());
      setCanScrollPrev(emblaApi.canScrollPrev());
      setCanScrollNext(emblaApi.canScrollNext());
      setHasOverflow(snaps.length > 1);

      // The edge fade only makes sense when neighbouring slides actually peek in.
      const container = emblaApi.containerNode();
      const [firstSlide] = emblaApi.slideNodes();
      setSlidesPeek(!!firstSlide && firstSlide.offsetWidth < container.offsetWidth * 0.96);
    };

    const syncProgress = () => {
      const fill = progressRef.current;
      if (!fill) return;
      const progress = Math.min(1, Math.max(0.08, emblaApi.scrollProgress()));
      fill.style.transform = `scaleX(${progress})`;
    };

    syncState();
    syncProgress();
    emblaApi.on('select', syncState);
    emblaApi.on('reInit', syncState);
    emblaApi.on('resize', syncState);
    emblaApi.on('scroll', syncProgress);
    emblaApi.on('reInit', syncProgress);

    return () => {
      emblaApi.off('select', syncState);
      emblaApi.off('reInit', syncState);
      emblaApi.off('resize', syncState);
      emblaApi.off('scroll', syncProgress);
      emblaApi.off('reInit', syncProgress);
    };
  }, [emblaApi]);

  useEffect(() => {
    const root = rootRef.current;
    if (!emblaApi || !root || !autoplay) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    let paused = false;
    let timer: number | null = null;

    const stop = () => {
      if (timer !== null) window.clearInterval(timer);
      timer = null;
    };

    const start = () => {
      stop();
      if (paused || document.hidden) return;
      timer = window.setInterval(() => {
        if (emblaApi.canScrollNext()) emblaApi.scrollNext();
        else emblaApi.scrollTo(0);
      }, autoplay);
    };

    const pause = () => {
      paused = true;
      stop();
    };

    const resume = () => {
      paused = false;
      start();
    };

    const onVisibilityChange = () => (document.hidden ? stop() : start());

    root.addEventListener('pointerenter', pause);
    root.addEventListener('pointerleave', resume);
    root.addEventListener('focusin', pause);
    root.addEventListener('focusout', resume);
    document.addEventListener('visibilitychange', onVisibilityChange);
    emblaApi.on('pointerDown', stop);
    emblaApi.on('pointerUp', start);
    emblaApi.on('select', start);

    start();

    return () => {
      stop();
      root.removeEventListener('pointerenter', pause);
      root.removeEventListener('pointerleave', resume);
      root.removeEventListener('focusin', pause);
      root.removeEventListener('focusout', resume);
      document.removeEventListener('visibilitychange', onVisibilityChange);
      emblaApi.off('pointerDown', stop);
      emblaApi.off('pointerUp', start);
      emblaApi.off('select', start);
    };
  }, [emblaApi, autoplay]);

  const controls: CarouselControls = {
    scrollPrev,
    scrollNext,
    canScrollPrev,
    canScrollNext,
    selectedIndex,
    slideCount: children.length,
  };
  const inHeader = controlsPlacement === 'header';
  const inCorner = controlsPlacement === 'corner';
  const showArrows = hasOverflow && !inHeader && !inCorner;

  const arrowPair = (
    <>
      <NavButton label="Ver anteriores" onClick={scrollPrev} disabled={!canScrollPrev}>
        <ChevronLeft className="h-5 w-5" aria-hidden="true" />
      </NavButton>
      <NavButton label="Ver siguientes" onClick={scrollNext} disabled={!canScrollNext}>
        <ChevronRight className="h-5 w-5" aria-hidden="true" />
      </NavButton>
    </>
  );

  return (
    <div
      ref={rootRef}
      role="region"
      aria-roledescription="carrusel"
      aria-label={ariaLabel}
      className={cn('relative', controlsPlacement === 'outside' && 'xl:px-16', className)}
    >
      {inHeader && hasOverflow && (
        <div className="mb-5 flex items-center justify-end gap-2">
          {renderControls ? renderControls(controls) : arrowPair}
        </div>
      )}

      {inCorner && hasOverflow && (
        <div className="absolute right-5 bottom-5 z-20 flex items-center gap-3 sm:right-8 sm:bottom-8">
          {renderControls ? renderControls(controls) : arrowPair}
        </div>
      )}

      <div
        ref={emblaRef}
        className={cn('overflow-hidden', hasOverflow && slidesPeek && 'edge-fade-x')}
      >
        <div className="flex cursor-grab touch-pan-y gap-4 active:cursor-grabbing sm:gap-5">
          {children.map((child, index) => (
            <div
              key={index}
              role="group"
              aria-roledescription="diapositiva"
              aria-label={`${index + 1} de ${children.length}`}
              className={cn('min-w-0 shrink-0 grow-0', slideClassName ?? 'w-full')}
            >
              {child}
            </div>
          ))}
        </div>
      </div>

      {showArrows && (
        <>
          <NavButton
            label="Ver anteriores"
            onClick={scrollPrev}
            disabled={!canScrollPrev}
            className={cn(
              'absolute top-1/2 z-10 -translate-y-1/2',
              controlsPlacement === 'outside' ? 'left-2 xl:left-0' : 'left-2 sm:left-3',
            )}
          >
            <ChevronLeft className="h-5 w-5" aria-hidden="true" />
          </NavButton>
          <NavButton
            label="Ver siguientes"
            onClick={scrollNext}
            disabled={!canScrollNext}
            className={cn(
              'absolute top-1/2 z-10 -translate-y-1/2',
              controlsPlacement === 'outside' ? 'right-2 xl:right-0' : 'right-2 sm:right-3',
            )}
          >
            <ChevronRight className="h-5 w-5" aria-hidden="true" />
          </NavButton>
        </>
      )}

      {showProgress && hasOverflow && (
        <div className="bg-ink-200/70 relative mt-6 h-[2px] w-full overflow-hidden rounded-full">
          <div
            ref={progressRef}
            className="bg-brand-600 absolute inset-0 origin-left rounded-full"
            style={{ transform: 'scaleX(0.08)' }}
          />
        </div>
      )}

      {showDots && scrollSnaps.length > 1 && (
        <div className="mt-6 flex items-center justify-center gap-1">
          {scrollSnaps.map((_, index) => {
            const active = index === selectedIndex;
            return (
              <button
                key={index}
                type="button"
                onClick={() => emblaApi?.scrollTo(index)}
                aria-label={`Ir a la diapositiva ${index + 1}`}
                aria-current={active ? 'true' : undefined}
                className="group/dot flex h-11 w-8 items-center justify-center"
              >
                <span className="relative block h-1.5 w-8">
                  <span
                    aria-hidden="true"
                    className={cn(
                      'bg-ink-200 group-hover/dot:bg-ink-300 absolute top-0 left-1/2 h-1.5 w-1.5',
                      '-translate-x-1/2 rounded-full transition-[opacity,background-color] duration-300 ease-[var(--ease-out-quint)]',
                      active ? 'opacity-0' : 'opacity-100',
                    )}
                  />
                  <span
                    aria-hidden="true"
                    className={cn(
                      'bg-brand-600 absolute inset-0 origin-center rounded-full',
                      'transition-[scale,opacity] duration-300 ease-[var(--ease-out-quint)]',
                      active ? 'scale-x-100 opacity-100' : 'scale-x-[0.1875] opacity-0',
                    )}
                  />
                </span>
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
