import type { StockStatus } from '../../types/product';
import { Badge, type BadgeTone } from '../ui/Badge';

interface StockPillProps {
  stock: StockStatus;
  className?: string;
}

/** Each state carries its own wording — colour alone never communicates availability. */
const stockStates: Record<StockStatus, { label: string; tone: BadgeTone; dot: boolean }> = {
  'in-stock': { label: 'En existencia', tone: 'success', dot: true },
  'low-stock': { label: 'Últimas piezas', tone: 'warn', dot: true },
  'out-of-stock': { label: 'Bajo pedido', tone: 'outline', dot: false },
};

export function StockPill({ stock, className }: StockPillProps) {
  const state = stockStates[stock];

  return (
    <Badge tone={state.tone} dot={state.dot} className={className}>
      {state.label}
    </Badge>
  );
}
