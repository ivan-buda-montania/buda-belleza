import type { LucideIcon } from 'lucide-react';
import { Reveal } from '../components/ui/Reveal';

interface ValuePropCardProps {
  icon: LucideIcon;
  title: string;
  description: string;
  /** 1-based position: prints the editorial ordinal and staggers the reveal. */
  index?: number;
}

export function ValuePropCard({ icon: Icon, title, description, index }: ValuePropCardProps) {
  return (
    <li className="group">
      <Reveal delay={index ? (index - 1) * 80 : 0} y={16} className="h-full">
        <div className="border-line group-hover:border-brand-400 flex h-full flex-col border-t pt-7 transition-colors duration-300 ease-[var(--ease-out-quint)]">
          <div className="flex items-center justify-between gap-4">
            {index !== undefined && (
              <span className="font-display text-display-sm text-ink-300 group-hover:text-ink-400 font-medium tabular-nums transition-colors duration-300 ease-[var(--ease-out-quint)]">
                {String(index).padStart(2, '0')}
              </span>
            )}
            <span
              aria-hidden="true"
              className="bg-gold-50 ring-gold-200 text-gold-600 group-hover:bg-gold-100 group-hover:ring-gold-300 flex h-11 w-11 shrink-0 items-center justify-center rounded-xl ring-1 transition-colors duration-300 ease-[var(--ease-out-quint)]"
            >
              <Icon className="h-6 w-6" strokeWidth={1.6} />
            </span>
          </div>
          <h3 className="text-ink-900 mt-6 font-semibold">{title}</h3>
          <p className="text-ink-600 mt-2 text-sm leading-relaxed">{description}</p>
        </div>
      </Reveal>
    </li>
  );
}
