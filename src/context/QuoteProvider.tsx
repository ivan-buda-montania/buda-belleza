import { useCallback, useEffect, useMemo, useState, type ReactNode } from 'react';
import { products } from '../data/products';
import { QuoteContext, QUOTE_STORAGE_KEY, type QuoteLine } from './quote-store';
import type { Product } from '../types/product';

interface StoredLine {
  id: string;
  quantity: number;
}

function readStored(): QuoteLine[] {
  if (typeof window === 'undefined') return [];
  try {
    const raw = window.localStorage.getItem(QUOTE_STORAGE_KEY);
    if (!raw) return [];
    const parsed: StoredLine[] = JSON.parse(raw);
    return parsed
      .map((line) => {
        const product = products.find((candidate) => candidate.id === line.id);
        return product ? { product, quantity: Math.max(1, line.quantity) } : null;
      })
      .filter((line): line is QuoteLine => line !== null);
  } catch {
    return [];
  }
}

/**
 * Quote (cotización) state. Wholesale buyers build a request, not a checkout —
 * so this persists locally and is submitted as a single quote request.
 */
export function QuoteProvider({ children }: { children: ReactNode }) {
  const [lines, setLines] = useState<QuoteLine[]>(readStored);
  const [isOpen, setIsOpen] = useState(false);
  const [lastAddedId, setLastAddedId] = useState<string | null>(null);

  useEffect(() => {
    try {
      const payload: StoredLine[] = lines.map((line) => ({
        id: line.product.id,
        quantity: line.quantity,
      }));
      window.localStorage.setItem(QUOTE_STORAGE_KEY, JSON.stringify(payload));
    } catch {
      /* storage unavailable (private mode) — the quote just won't persist */
    }
  }, [lines]);

  useEffect(() => {
    if (!lastAddedId) return;
    const timer = window.setTimeout(() => setLastAddedId(null), 1600);
    return () => window.clearTimeout(timer);
  }, [lastAddedId]);

  const add = useCallback((product: Product, quantity = 1) => {
    setLines((current) => {
      const existing = current.find((line) => line.product.id === product.id);
      if (existing) {
        return current.map((line) =>
          line.product.id === product.id ? { ...line, quantity: line.quantity + quantity } : line,
        );
      }
      return [...current, { product, quantity }];
    });
    setLastAddedId(product.id);
  }, []);

  const remove = useCallback((productId: string) => {
    setLines((current) => current.filter((line) => line.product.id !== productId));
  }, []);

  const setQuantity = useCallback((productId: string, quantity: number) => {
    setLines((current) =>
      quantity <= 0
        ? current.filter((line) => line.product.id !== productId)
        : current.map((line) => (line.product.id === productId ? { ...line, quantity } : line)),
    );
  }, []);

  const clear = useCallback(() => setLines([]), []);
  const open = useCallback(() => setIsOpen(true), []);
  const close = useCallback(() => setIsOpen(false), []);

  const value = useMemo(() => {
    const totalUnits = lines.reduce((sum, line) => sum + line.quantity, 0);

    return {
      lines,
      itemCount: lines.length,
      totalUnits,
      isOpen,
      add,
      remove,
      setQuantity,
      clear,
      open,
      close,
      lastAddedId,
    };
  }, [lines, isOpen, add, remove, setQuantity, clear, open, close, lastAddedId]);

  return <QuoteContext.Provider value={value}>{children}</QuoteContext.Provider>;
}
