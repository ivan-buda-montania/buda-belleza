import { SearchX } from 'lucide-react';
import { cn } from '../../lib/cn';
import type { Product } from '../../types/product';
import { Reveal } from '../ui/Reveal';
import { ProductCard } from './ProductCard';

interface ProductGridProps {
  products: Product[];
  className?: string;
  /** Columns from `lg` up. Below that the grid is always 2 → 3. */
  columns?: 2 | 3 | 4;
  emptyMessage?: string;
}

const columnStyles = {
  2: 'lg:grid-cols-2',
  3: 'lg:grid-cols-3',
  4: 'lg:grid-cols-4',
} as const;

export function ProductGrid({
  products,
  className,
  columns = 4,
  emptyMessage = 'No encontramos productos con estos filtros.',
}: ProductGridProps) {
  if (products.length === 0) {
    return (
      <Reveal className={cn('flex justify-center', className)}>
        <div className="border-line-strong rounded-panel bg-surface/60 flex w-full flex-col items-center gap-4 border border-dashed px-6 py-16 text-center">
          <span className="bg-ink-100 text-ink-400 flex h-14 w-14 items-center justify-center rounded-full">
            <SearchX className="h-6 w-6" aria-hidden="true" />
          </span>
          <p className="font-display text-display-sm text-ink-900 font-medium">{emptyMessage}</p>
          <p className="text-ink-500 max-w-md text-sm leading-relaxed">
            Prueba con menos filtros o busca por marca. Manejamos más de 4 500 claves en piso y
            conseguimos sobre pedido lo que no aparece aquí.
          </p>
        </div>
      </Reveal>
    );
  }

  return (
    <ul
      className={cn(
        'grid grid-cols-2 gap-4 sm:grid-cols-3 sm:gap-5 xl:gap-6',
        columnStyles[columns],
        className,
      )}
    >
      {products.map((product, index) => (
        <Reveal key={product.id} as="li" delay={Math.min(index, 7) * 55} y={16} className="h-full">
          <ProductCard product={product} />
        </Reveal>
      ))}
    </ul>
  );
}
