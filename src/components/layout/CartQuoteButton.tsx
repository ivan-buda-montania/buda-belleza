import { ShoppingCart } from 'lucide-react';
import { useEffect, useState } from 'react';
import { useQuote } from '../../context/quote-store';
import { cn } from '../../lib/cn';

interface CartQuoteButtonProps {
  className?: string;
}

export function CartQuoteButton({ className }: CartQuoteButtonProps) {
  const { itemCount, open, lastAddedId } = useQuote();
  const [pulse, setPulse] = useState(false);

  useEffect(() => {
    if (!lastAddedId) return;
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    setPulse(true);
    const timer = window.setTimeout(() => setPulse(false), 420);
    return () => window.clearTimeout(timer);
  }, [lastAddedId]);

  const label =
    itemCount === 0
      ? 'Abrir el carrito, sin productos'
      : `Abrir el carrito, ${itemCount} ${itemCount === 1 ? 'producto' : 'productos'}`;

  return (
    <button
      type="button"
      onClick={open}
      aria-label={label}
      className={cn(
        'bg-ink-900 hover:bg-ink-800 relative flex h-11 cursor-pointer items-center gap-2 rounded-full px-3.5 text-sm font-semibold text-white shadow-[var(--shadow-e2)] transition-[background-color,transform,translate,scale,rotate] duration-250 ease-[var(--ease-out-quint)] active:translate-y-px lg:px-5',
        className,
      )}
    >
      <ShoppingCart className="h-[1.15rem] w-[1.15rem] shrink-0" aria-hidden="true" />
      <span className="hidden lg:inline">Tu Carrito</span>
      {itemCount > 0 && (
        <span
          aria-hidden="true"
          className={cn(
            'bg-brand-600 ring-canvas absolute -top-1 -right-1 grid h-5 min-w-5 place-items-center rounded-full px-1 text-[0.6875rem] leading-none font-bold text-white tabular-nums ring-2 transition-transform duration-200 ease-[var(--ease-spring)]',
            pulse ? 'scale-125' : 'scale-100',
          )}
        >
          {itemCount}
        </span>
      )}
    </button>
  );
}
