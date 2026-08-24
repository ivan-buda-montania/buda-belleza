import { Plus } from 'lucide-react';
import { useId, useState, type ReactNode } from 'react';
import { cn } from '../../lib/cn';

export interface AccordionItem {
  id: string;
  question: string;
  answer: ReactNode;
}

interface AccordionProps {
  items: AccordionItem[];
  className?: string;
  /** Keep several panels open at once. Default is one-at-a-time. */
  allowMultiple?: boolean;
}

/**
 * Height is animated through `grid-rows-[0fr] → [1fr]` rather than `height`, so the
 * transition stays on the compositor and the panel keeps its natural size.
 */
export function Accordion({ items, className, allowMultiple = false }: AccordionProps) {
  const uid = useId();
  const [openIds, setOpenIds] = useState<string[]>([]);

  const toggle = (id: string) => {
    setOpenIds((prev) => {
      if (prev.includes(id)) return prev.filter((openId) => openId !== id);
      return allowMultiple ? [...prev, id] : [id];
    });
  };

  return (
    <div className={cn('divide-line border-line divide-y border-y', className)}>
      {items.map((item) => {
        const isOpen = openIds.includes(item.id);
        const triggerId = `${uid}-${item.id}-trigger`;
        const panelId = `${uid}-${item.id}-panel`;

        return (
          <div key={item.id}>
            {/* The heading wrapper is what lets screen-reader users jump question to question. */}
            <h3>
              <button
                type="button"
                id={triggerId}
                aria-expanded={isOpen}
                aria-controls={panelId}
                onClick={() => toggle(item.id)}
                className="group hover:bg-ink-50 flex w-full cursor-pointer items-center justify-between gap-6 px-2 py-6 text-left transition-colors duration-200 ease-[var(--ease-out-quint)] sm:px-4"
              >
                <span className="text-ink-900 text-base font-semibold sm:text-[1.0625rem]">
                  {item.question}
                </span>
                <span
                  aria-hidden="true"
                  className={cn(
                    'grid h-9 w-9 shrink-0 place-items-center rounded-full ring-1 transition-colors duration-250 ease-[var(--ease-out-quint)]',
                    isOpen
                      ? 'bg-brand-600 text-white ring-transparent'
                      : 'bg-surface text-ink-600 ring-line group-hover:ring-line-strong group-hover:text-ink-900',
                  )}
                >
                  <Plus
                    className={cn(
                      'h-4 w-4 transition-transform duration-300 ease-[var(--ease-out-quint)]',
                      isOpen && 'rotate-45',
                    )}
                  />
                </span>
              </button>
            </h3>

            <div
              id={panelId}
              role="region"
              aria-labelledby={triggerId}
              className={cn(
                'grid transition-[grid-template-rows] duration-400 ease-[var(--ease-out-quint)]',
                isOpen ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]',
              )}
            >
              <div className="overflow-hidden" inert={!isOpen}>
                <div className="text-ink-600 max-w-2xl px-2 pb-7 text-sm leading-relaxed sm:px-4 sm:text-[0.9375rem]">
                  {item.answer}
                </div>
              </div>
            </div>
          </div>
        );
      })}
    </div>
  );
}
