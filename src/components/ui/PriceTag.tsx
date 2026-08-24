import { cn } from '../../lib/cn';
import { discountPercent, formatPrice } from '../../lib/format';
import type { Price } from '../../types/product';

interface PriceTagProps {
  price: Price;
  size?: 'sm' | 'md' | 'lg';
  className?: string;
}

const wholesaleSize = {
  sm: 'text-base',
  md: 'text-xl',
  lg: 'text-display-sm',
} as const;

export function PriceTag({ price, size = 'md', className }: PriceTagProps) {
  const discount = discountPercent(price.regular, price.wholesale);

  return (
    <div className={cn('flex flex-col gap-0.5', className)}>
      <span className="eyebrow text-ink-400">Precio mayorista</span>
      <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
        <span
          className={cn(
            'text-ink-900 font-display leading-none font-semibold tabular-nums',
            wholesaleSize[size],
          )}
        >
          {formatPrice(price.wholesale)}
        </span>
        <span className="text-ink-400 text-xs tabular-nums line-through">
          {formatPrice(price.regular)}
        </span>
        {discount > 0 && (
          <span className="text-brand-600 text-xs font-bold tabular-nums">−{discount}%</span>
        )}
      </div>
    </div>
  );
}
