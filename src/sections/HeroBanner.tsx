import { ArrowLeft, ArrowRight, Sparkles } from 'lucide-react';
import { useEffect, useRef, useState, type ElementType, type RefObject } from 'react';
import { Carousel, type CarouselControls } from '../components/carousel/Carousel';
import { Badge } from '../components/ui/Badge';
import { ButtonLink } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { SmartImage } from '../components/ui/SmartImage';
import { cn } from '../lib/cn';
import type { Banner } from '../types/banner';

interface HeroBannerProps {
  banners: Banner[];
}

interface HeroSlideProps {
  banner: Banner;
  index: number;
  stageRef: RefObject<HTMLElement | null>;
}

const cascade = (order: number) => ({ animationDelay: `${order * 70}ms` });

/** Split the headline around its accent word so only that word takes the gold serif. */
function splitHeadline(headline: string, accentWord?: string) {
  if (!accentWord) return null;
  const start = headline.indexOf(accentWord);
  if (start === -1) return null;
  const end = start + accentWord.length;
  return {
    before: headline.slice(0, start),
    accent: headline.slice(start, end),
    after: headline.slice(end),
  };
}

/**
 * The carousel primitive owns the transport, so the slide watches its own visibility
 * inside the stage to know when it is the one on screen: that drives the Ken Burns
 * push and replays the copy cascade on every rotation.
 */
function HeroSlide({ banner, index, stageRef }: HeroSlideProps) {
  const slideRef = useRef<HTMLDivElement>(null);
  const [state, setState] = useState({ active: index === 0, run: 0 });

  useEffect(() => {
    const node = slideRef.current;
    if (!node || typeof IntersectionObserver === 'undefined') {
      setState({ active: true, run: 0 });
      return;
    }

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (!entry) return;
        setState((prev) => {
          if (entry.isIntersecting === prev.active) return prev;
          return {
            active: entry.isIntersecting,
            run: entry.isIntersecting ? prev.run + 1 : prev.run,
          };
        });
      },
      { root: stageRef.current, threshold: 0.6 },
    );

    observer.observe(node);
    return () => observer.disconnect();
  }, [stageRef]);

  const parts = splitHeadline(banner.headline, banner.accentWord);
  const Headline: ElementType = index === 0 ? 'h1' : 'p';

  return (
    <div
      ref={slideRef}
      className="relative flex h-full min-h-[30rem] w-full flex-col justify-end sm:min-h-[34rem] lg:min-h-[42rem]"
    >
      <div className={cn('absolute inset-0', state.active && 'animate-ken-burns')}>
        <SmartImage
          id={banner.imageId}
          alt=""
          width={1920}
          height={1080}
          sizes="100vw"
          priority={index === 0}
          wrapperClassName="h-full w-full"
        />
      </div>

      <div
        aria-hidden="true"
        className="from-ink-950/85 via-ink-950/45 absolute inset-0 bg-gradient-to-t to-transparent"
      />
      <div
        aria-hidden="true"
        className="from-ink-950/70 absolute inset-0 bg-gradient-to-r to-transparent"
      />

      <div
        key={`${banner.id}-${state.run}`}
        className="relative z-10 flex max-w-2xl flex-col items-start gap-4 p-7 pb-20 sm:gap-6 sm:p-12 sm:pb-24 lg:p-16 lg:pb-24"
      >
        <div className="animate-fade-up" style={cascade(0)}>
          <Eyebrow tone="onDark">{banner.eyebrow}</Eyebrow>
        </div>

        <Headline
          className="font-display text-display-xl animate-fade-up font-medium text-balance text-white"
          style={cascade(1)}
        >
          {parts ? (
            <>
              {parts.before}
              <em className="text-gradient-gold italic">{parts.accent}</em>
              {parts.after}
            </>
          ) : (
            banner.headline
          )}
        </Headline>

        <p className="text-lead text-ink-200 animate-fade-up max-w-xl" style={cascade(2)}>
          {banner.subcopy}
        </p>

        <div className="animate-fade-up flex flex-wrap items-center gap-3 pt-1" style={cascade(3)}>
          <ButtonLink to={banner.ctaPrimary.href} size="lg">
            {banner.ctaPrimary.label}
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
            />
          </ButtonLink>
          {banner.ctaSecondary && (
            <ButtonLink to={banner.ctaSecondary.href} variant="glass" size="lg">
              {banner.ctaSecondary.label}
            </ButtonLink>
          )}
        </div>

        {banner.note && (
          <div className="animate-fade-up" style={cascade(4)}>
            <Badge tone="glass" className="gap-2 px-3 py-1.5">
              <Sparkles aria-hidden="true" className="text-gold-300 h-3.5 w-3.5 shrink-0" />
              {banner.note}
            </Badge>
          </div>
        )}
      </div>
    </div>
  );
}

const pad = (value: number) => String(value + 1).padStart(2, '0');

/**
 * Hero transport lives in the bottom-right corner: a slide counter plus glass arrows,
 * clear of the copy block on every breakpoint.
 */
function renderHeroControls({
  scrollPrev,
  scrollNext,
  selectedIndex,
  slideCount,
}: CarouselControls) {
  const arrow =
    'grid h-11 w-11 cursor-pointer place-items-center rounded-full border border-white/25 bg-white/12 text-white backdrop-blur-md transition-colors duration-250 ease-[var(--ease-out-quint)] hover:bg-white hover:text-ink-900';

  return (
    <>
      <p className="hidden items-baseline gap-1.5 text-sm text-white/60 tabular-nums sm:flex">
        <span className="font-display text-lg text-white">{pad(selectedIndex)}</span>
        <span aria-hidden="true">/</span>
        <span>{pad(slideCount - 1)}</span>
        <span className="sr-only">
          Diapositiva {selectedIndex + 1} de {slideCount}
        </span>
      </p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          onClick={scrollPrev}
          aria-label="Promoción anterior"
          className={arrow}
        >
          <ArrowLeft className="h-4 w-4" aria-hidden="true" />
        </button>
        <button
          type="button"
          onClick={scrollNext}
          aria-label="Promoción siguiente"
          className={arrow}
        >
          <ArrowRight className="h-4 w-4" aria-hidden="true" />
        </button>
      </div>
    </>
  );
}

export function HeroBanner({ banners }: HeroBannerProps) {
  const stageRef = useRef<HTMLElement>(null);

  return (
    <div className="shell pt-4">
      <section
        ref={stageRef}
        className="grain rounded-hero bg-ink-950 relative min-h-[30rem] overflow-hidden shadow-[var(--shadow-e3)] sm:min-h-[34rem] lg:min-h-[42rem]"
      >
        <Carousel
          slideClassName="w-full"
          ariaLabel="Promociones destacadas"
          autoplay={7000}
          options={{ loop: true }}
          controlsPlacement="corner"
          renderControls={renderHeroControls}
        >
          {banners.map((banner, index) => (
            <HeroSlide key={banner.id} banner={banner} index={index} stageRef={stageRef} />
          ))}
        </Carousel>
      </section>
    </div>
  );
}
