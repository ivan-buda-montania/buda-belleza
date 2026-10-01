import { ArrowUpRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Badge } from '../components/ui/Badge';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SmartImage } from '../components/ui/SmartImage';
import { cn } from '../lib/cn';
import { formatReferences } from '../lib/format';
import type { Category } from '../types/category';

interface CategoryCtaGridProps {
  categories: Category[];
}

type TileSize = 'feature' | 'wide' | 'default';

interface CategoryTileProps {
  category: Category;
  size: TileSize;
}

function CategoryTile({ category, size }: CategoryTileProps) {
  const roomy = size !== 'default';
  return (
    <Link
      to={`/categoria/${category.slug}`}
      className="group rounded-panel ring-ink-950/10 relative flex h-full w-full flex-col justify-end overflow-hidden ring-1 transition-shadow duration-300 ease-[var(--ease-out-quint)] hover:shadow-[var(--shadow-e3)] focus-visible:shadow-[var(--shadow-e3)]"
    >
      <div className="absolute inset-0 transition-transform duration-700 ease-[var(--ease-out-quint)] group-hover:scale-[1.06] group-focus-visible:scale-[1.06]">
        <SmartImage
          id={category.imageId}
          alt=""
          width={roomy ? 900 : 480}
          height={size === 'feature' ? 700 : size === 'wide' ? 380 : 480}
          sizes={roomy ? '(min-width: 1024px) 46vw, 100vw' : '(min-width: 1024px) 22vw, 50vw'}
          wrapperClassName="h-full w-full"
        />
      </div>

      <div
        aria-hidden="true"
        className="from-ink-950/92 via-ink-950/55 to-ink-950/15 absolute inset-0 bg-gradient-to-t"
      />
      <div
        aria-hidden="true"
        className="from-ink-950 via-ink-950/55 absolute inset-0 bg-gradient-to-t to-transparent opacity-0 transition-opacity duration-500 ease-[var(--ease-out-quint)] group-hover:opacity-75 group-focus-visible:opacity-75"
      />

      <div className={cn('relative z-10 flex flex-col gap-2', roomy ? 'p-6 sm:p-8' : 'p-4 sm:p-5')}>
        <h3 className="font-display text-display-sm font-medium text-white">{category.name}</h3>
        <p
          className={cn(
            'text-ink-200 line-clamp-2 text-sm leading-snug',
            !roomy && 'hidden lg:block',
          )}
        >
          {category.tagline}
        </p>
        <div className="mt-3 flex items-center justify-between gap-3">
          <Badge tone="glass">{formatReferences(category.productCount)}</Badge>
          <span
            aria-hidden="true"
            className="group-hover:text-ink-900 group-focus-visible:text-ink-900 flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-white/25 bg-white/12 text-white backdrop-blur-md transition-[transform,translate,scale,rotate,background-color,color] duration-300 ease-[var(--ease-out-quint)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:bg-white group-focus-visible:translate-x-0.5 group-focus-visible:-translate-y-0.5 group-focus-visible:bg-white"
          >
            <ArrowUpRight className="h-4 w-4" />
          </span>
        </div>
      </div>
    </Link>
  );
}

const spanStyles: Record<TileSize, string> = {
  feature: 'col-span-2 aspect-[4/3] lg:row-span-2',
  wide: 'col-span-2 aspect-[16/9] lg:col-span-4 lg:aspect-[6/1]',
  default: 'aspect-square',
};

/**
 * Bento rhythm: the first category anchors a 2x2 block and the last one closes the grid
 * as a full-width band, so six tiles resolve into complete rows at every breakpoint.
 */
function tileSize(index: number, total: number): TileSize {
  if (index === 0) return 'feature';
  if (index === total - 1) return 'wide';
  return 'default';
}

export function CategoryCtaGrid({ categories }: CategoryCtaGridProps) {
  return (
    <Section tone="canvas" padding="lg" aria-labelledby="categorias-title">
      <SectionHeading
        id="categorias-title"
        eyebrow="Catálogo por especialidad"
        title="Todo lo que tu cabina consume, en un solo proveedor"
        description="Las especialidades que surtimos, con reposición constante para que nunca canceles un servicio por falta de producto."
        action={
          <ButtonLink to="/catalogo" variant="outline">
            Ver catálogo completo
          </ButtonLink>
        }
      />

      <div className="mt-10 grid grid-cols-2 gap-4 lg:auto-rows-[13rem] lg:grid-cols-4">
        {categories.map((category, index) => {
          const size = tileSize(index, categories.length);
          return (
            <Reveal
              key={category.slug}
              delay={index * 70}
              scale={0.985}
              className={cn('lg:aspect-auto', spanStyles[size])}
            >
              <CategoryTile category={category} size={size} />
            </Reveal>
          );
        })}
      </div>
    </Section>
  );
}
