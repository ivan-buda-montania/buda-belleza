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

/** "1 referencia" / "1,234 referencias". */
export function formatReferences(count: number) {
  return `${formatInteger(count)} ${count === 1 ? 'referencia' : 'referencias'}`;
}
