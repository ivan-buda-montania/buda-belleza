import { Check, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuote } from '../../context/quote-store';
import { getBrandById } from '../../data/brands';
import { cn } from '../../lib/cn';
import type { Product, ProductTag } from '../../types/product';
import { Badge, type BadgeTone } from '../ui/Badge';
import { Button } from '../ui/Button';
import { PriceTag } from '../ui/PriceTag';
import { SmartImage } from '../ui/SmartImage';
import { StockPill } from './StockPill';

interface ProductCardProps {
  product: Product;
  className?: string;
  /** Eager-load the image — only for cards above the fold. */
  priority?: boolean;
}

const tagStyles: Record<ProductTag, { label: string; tone: BadgeTone }> = {
  bestseller: { label: 'Más vendido', tone: 'brand' },
  new: { label: 'Nuevo', tone: 'gold' },
  'volume-offer': { label: 'Oferta por volumen', tone: 'ink' },
};

export function ProductCard({ product, className, priority = false }: ProductCardProps) {
  const { add, lastAddedId } = useQuote();
  const brand = getBrandById(product.brandId);
  const justAdded = lastAddedId === product.id;
  const minQty = product.price.minWholesaleQty ?? 6;
  const tags = product.tags?.slice(0, 2) ?? [];

  return (
    <article
      className={cn(
        'group bg-surface rounded-card ring-ink-900/[0.05] @container relative flex h-full flex-col ring-1',
        'shadow-[var(--shadow-e1)] transition-[transform,translate,scale,rotate,box-shadow] duration-300 ease-[var(--ease-out-quint)]',
        'hover:ring-brand-200 hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]',
        'focus-within:ring-brand-200 focus-within:-translate-y-1 focus-within:shadow-[var(--shadow-e3)]',
        className,
      )}
    >
      <div className="rounded-t-card relative overflow-hidden">
        <SmartImage
          id={product.imageId}
          alt={`${product.name} — ${brand?.name ?? 'Buda Belleza'}, presentación de ${product.presentation}`}
          width={480}
          height={480}
          priority={priority}
          sizes="(min-width:1024px) 25vw, (min-width:640px) 33vw, 50vw"
          wrapperClassName="aspect-square transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.05]"
        />

        <div
          aria-hidden="true"
          className="from-ink-950/20 absolute inset-x-0 top-0 h-24 bg-gradient-to-b to-transparent"
        />

        {tags.length > 0 && (
          <div className="absolute top-3 left-3 flex flex-col items-start gap-1.5">
            {tags.map((tag) => (
              <Badge key={tag} tone={tagStyles[tag].tone} className="shadow-[var(--shadow-e1)]">
                {tagStyles[tag].label}
              </Badge>
            ))}
          </div>
        )}

        <button
          type="button"
          onClick={() => add(product)}
          aria-label={
            justAdded
              ? `${product.name} añadido a la cotización`
              : `Añadir ${product.name} a la cotización`
          }
          className={cn(
            'bg-surface/90 ring-ink-900/[0.06] absolute right-3 bottom-3 z-10 flex h-11 w-11',
            'items-center justify-center rounded-full opacity-100 shadow-[var(--shadow-e2)] ring-1 backdrop-blur-md',
            'transition-[translate,scale,opacity,background-color,color] duration-250 ease-[var(--ease-out-quint)]',
            'hover:bg-brand-600 hover:text-white active:scale-95',
            // Always available on touch; a hover/focus affordance from lg up.
            'lg:h-10 lg:w-10 lg:translate-y-2 lg:opacity-0 lg:group-hover:translate-y-0 lg:group-hover:opacity-100',
            'lg:group-focus-within:translate-y-0 lg:group-focus-within:opacity-100',
            justAdded ? 'text-success-700' : 'text-brand-600',
          )}
        >
          {justAdded ? (
            <Check className="h-[18px] w-[18px]" aria-hidden="true" />
          ) : (
            <Plus className="h-[18px] w-[18px]" aria-hidden="true" />
          )}
        </button>
      </div>

      <div className="flex flex-1 flex-col gap-2 p-4">
        <span className="eyebrow text-ink-400">{brand?.name}</span>

        {/* The clamp lives on the inner span so its overflow can't crop the full-card overlay. */}
        <h3 className="text-ink-900 text-sm leading-snug font-semibold">
          <Link
            to={`/categoria/${product.categorySlug}`}
            className="group-hover:text-brand-700 transition-colors duration-250 ease-[var(--ease-out-quint)] after:absolute after:inset-0 after:content-['']"
          >
            <span className="line-clamp-2">{product.name}</span>
          </Link>
        </h3>

        <p className="text-ink-400 text-xs">
          {product.presentation} · Caja con {product.unitsPerCase}
        </p>

        <span className="sr-only">SKU {product.sku}</span>

        <div className="mt-auto pt-1">
          <StockPill stock={product.stock} />
        </div>
      </div>

      <div className="border-line border-t px-4 pt-3 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-3 @max-[11rem]:flex-col @max-[11rem]:items-stretch">
          <PriceTag price={product.price} size="sm" className="min-w-0 flex-1" />
          <Button
            size="sm"
            variant={justAdded ? 'subtle' : 'primary'}
            onClick={() => add(product)}
            aria-label={
              justAdded
                ? `${product.name} añadido a la cotización`
                : `Añadir ${product.name} a la cotización`
            }
            className={cn(
              'relative z-10 shrink-0 @max-[11rem]:w-full',
              justAdded && 'bg-success-100! text-success-700! hover:bg-success-100!',
            )}
          >
            {justAdded ? (
              <>
                <Check className="h-4 w-4" aria-hidden="true" />
                Añadido
              </>
            ) : (
              'Añadir'
            )}
          </Button>
        </div>
        <p className="text-ink-400 mt-2 text-[0.6875rem]">Desde {minQty} pzas</p>
      </div>
    </article>
  );
}
