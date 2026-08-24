import { createContext, useContext } from 'react';
import type { Product } from '../types/product';

export interface QuoteLine {
  product: Product;
  quantity: number;
}

export interface QuoteState {
  lines: QuoteLine[];
  itemCount: number;
  totalUnits: number;
  subtotal: number;
  savings: number;
  isOpen: boolean;
  add: (product: Product, quantity?: number) => void;
  remove: (productId: string) => void;
  setQuantity: (productId: string, quantity: number) => void;
  clear: () => void;
  open: () => void;
  close: () => void;
  /** Product id of the most recent add — lets cards flash a confirmation. */
  lastAddedId: string | null;
}

export const QuoteContext = createContext<QuoteState | null>(null);

export function useQuote(): QuoteState {
  const context = useContext(QuoteContext);
  if (!context) {
    throw new Error('useQuote debe usarse dentro de <QuoteProvider>');
  }
  return context;
}

export const QUOTE_STORAGE_KEY = 'buda-belleza:quote:v1';
export const QUOTE_MINIMUM_MXN = 3000;
/** Free-shipping threshold. Single source of truth — it is quoted in several places. */
export const FREE_SHIPPING_MXN = 6000;
