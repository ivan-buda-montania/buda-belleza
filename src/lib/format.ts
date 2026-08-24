const currencyFormatter = new Intl.NumberFormat('es-MX', {
  style: 'currency',
  currency: 'MXN',
  minimumFractionDigits: 0,
  maximumFractionDigits: 2,
});

const compactFormatter = new Intl.NumberFormat('es-MX', {
  notation: 'compact',
  maximumFractionDigits: 1,
});

const integerFormatter = new Intl.NumberFormat('es-MX');

export function formatPrice(amount: number) {
  return currencyFormatter.format(amount);
}

export function formatCompact(amount: number) {
  return compactFormatter.format(amount);
}

export function formatInteger(amount: number) {
  return integerFormatter.format(amount);
}

/** Whole-percent discount of `wholesale` against `regular` (e.g. 28 → "-28%"). */
export function discountPercent(regular: number, wholesale: number) {
  if (regular <= 0 || wholesale >= regular) return 0;
  return Math.round((1 - wholesale / regular) * 100);
}
