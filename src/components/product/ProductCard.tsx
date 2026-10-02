import { Check, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useQuote } from '../../context/quote-store';
import { getBrandById } from '../../data/brands';
import { getCategoryBySlug } from '../../data/categories';
import { cn } from '../../lib/cn';
import type { Product, ProductTag } from '../../types/product';
import { categoryIconMap } from '../icons/categoryIconMap';
import { Badge, type BadgeTone } from '../ui/Badge';
import { Button } from '../ui/Button';

interface ProductCardProps {
  product: Product;
  className?: string;
}

const tagStyles: Record<ProductTag, { label: string; tone: BadgeTone }> = {
  bestseller: { label: 'Más vendido', tone: 'brand' },
  new: { label: 'Nuevo', tone: 'gold' },
};

export function ProductCard({ product, className }: ProductCardProps) {
  const { add, lastAddedId } = useQuote();
  const brand = getBrandById(product.brandId);
  const category = getCategoryBySlug(product.categorySlug);
  const CategoryIcon = category
    ? categoryIconMap[category.icon as keyof typeof categoryIconMap]
    : undefined;
  const justAdded = lastAddedId === product.id;
  const tags = product.tags ?? [];

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
        {product.image ? (
          <div className="flex aspect-[4/3] items-center justify-center bg-white p-4">
            <img
              src={product.image}
              alt={product.name}
              loading="lazy"
              decoding="async"
              className="h-full w-full object-contain transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-[1.04]"
            />
          </div>
        ) : (
          // Products without an official photo show their category instead of a stock image.
          <div
            aria-hidden="true"
            className="from-brand-50 to-gold-50 flex aspect-[4/3] flex-col items-center justify-center gap-2.5 bg-gradient-to-br"
          >
            <span className="bg-surface/80 text-brand-600 grid h-14 w-14 place-items-center rounded-full shadow-[var(--shadow-e1)] transition-transform duration-500 ease-[var(--ease-out-quint)] group-hover:scale-110">
              {CategoryIcon && <CategoryIcon className="h-6 w-6" />}
            </span>
            <span className="eyebrow text-ink-500">{category?.name}</span>
          </div>
        )}

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
            justAdded ? `${product.name} añadido al carrito` : `Añadir ${product.name} al carrito`
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
        {brand && <span className="eyebrow text-ink-400">{brand.name}</span>}

        {/* The clamp lives on the inner span so its overflow can't crop the full-card overlay. */}
        <h3 className="text-ink-900 text-sm leading-snug font-semibold">
          <Link
            to={`/categoria/${product.categorySlug}`}
            className="group-hover:text-brand-700 transition-colors duration-250 ease-[var(--ease-out-quint)] after:absolute after:inset-0 after:content-['']"
          >
            <span className="line-clamp-2">{product.name}</span>
          </Link>
        </h3>

        <p className="text-ink-400 mt-auto pt-1 text-xs tabular-nums">Clave {product.sku}</p>
      </div>

      <div className="border-line border-t px-4 pt-3 pb-4">
        <div className="flex flex-wrap items-end justify-between gap-x-3 gap-y-3 @max-[11rem]:flex-col @max-[11rem]:items-stretch">
          <p className="text-ink-500 min-w-0 flex-1 text-xs leading-snug">Precio en cotización</p>
          <Button
            size="sm"
            variant={justAdded ? 'subtle' : 'primary'}
            onClick={() => add(product)}
            aria-label={
              justAdded ? `${product.name} añadido al carrito` : `Añadir ${product.name} al carrito`
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
      </div>
    </article>
  );
}
