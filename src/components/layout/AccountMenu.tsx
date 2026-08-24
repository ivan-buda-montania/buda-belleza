import {
  ChevronDown,
  FileText,
  LogIn,
  Package,
  Receipt,
  User,
  UserPlus,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useId, useRef, useState, type KeyboardEvent } from 'react';
import { Link } from 'react-router-dom';
import { useQuote } from '../../context/quote-store';
import { cn } from '../../lib/cn';

interface MenuEntry {
  id: string;
  label: string;
  icon: LucideIcon;
  to?: string;
}

const entries: MenuEntry[] = [
  { id: 'login', label: 'Iniciar sesión', icon: LogIn, to: '/mayoristas' },
  { id: 'signup', label: 'Crear cuenta mayorista', icon: UserPlus, to: '/mayoristas' },
  { id: 'quotes', label: 'Mis cotizaciones', icon: FileText },
  { id: 'orders', label: 'Mis pedidos', icon: Package, to: '/contacto' },
  { id: 'billing', label: 'Facturación', icon: Receipt, to: '/contacto' },
];

const itemClass =
  'text-ink-700 hover:bg-ink-50 hover:text-ink-900 flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-left text-sm font-medium transition-colors';

export function AccountMenu() {
  const menuId = useId();
  const { open: openQuote } = useQuote();
  const [open, setOpen] = useState(false);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const rootRef = useRef<HTMLDivElement>(null);
  const itemRefs = useRef<(HTMLElement | null)[]>([]);

  useEffect(() => {
    if (!open) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [open]);

  useEffect(() => {
    if (open) itemRefs.current[0]?.focus();
  }, [open]);

  const close = (returnFocus = true) => {
    setOpen(false);
    if (returnFocus) triggerRef.current?.focus();
  };

  const handleMenuKeyDown = (event: KeyboardEvent<HTMLUListElement>) => {
    const focusables = itemRefs.current.filter((node): node is HTMLElement => node !== null);
    const currentIndex = focusables.findIndex((node) => node === document.activeElement);

    if (event.key === 'Escape') {
      event.preventDefault();
      close();
      return;
    }
    if (event.key === 'Tab') {
      setOpen(false);
      return;
    }
    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      event.preventDefault();
      const step = event.key === 'ArrowDown' ? 1 : -1;
      const next = (currentIndex + step + focusables.length) % focusables.length;
      focusables[next]?.focus();
      return;
    }
    if (event.key === 'Home' || event.key === 'End') {
      event.preventDefault();
      focusables[event.key === 'Home' ? 0 : focusables.length - 1]?.focus();
    }
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        ref={triggerRef}
        type="button"
        aria-haspopup="menu"
        aria-expanded={open}
        aria-controls={open ? menuId : undefined}
        onClick={() => setOpen((current) => !current)}
        onKeyDown={(event) => {
          if (event.key === 'ArrowDown') {
            event.preventDefault();
            setOpen(true);
          }
        }}
        className={cn(
          'text-ink-700 hover:bg-ink-100 hover:text-ink-900 flex h-11 cursor-pointer items-center gap-2 rounded-full px-3 text-sm font-medium transition-colors lg:px-4',
          open && 'bg-ink-100 text-ink-900',
        )}
      >
        <User className="h-[1.15rem] w-[1.15rem] shrink-0" aria-hidden="true" />
        <span className="hidden lg:inline">Cuenta</span>
        <ChevronDown
          className={cn(
            'hidden h-3.5 w-3.5 transition-transform duration-250 ease-[var(--ease-out-quint)] lg:block',
            open && 'rotate-180',
          )}
          aria-hidden="true"
        />
      </button>

      {open && (
        <ul
          id={menuId}
          role="menu"
          aria-label="Cuenta"
          onKeyDown={handleMenuKeyDown}
          className="rounded-panel bg-surface ring-ink-900/[0.06] animate-fade-up absolute top-full right-0 z-50 mt-2.5 w-64 p-1.5 shadow-[var(--shadow-e4)] ring-1"
        >
          {entries.map((entry, index) => {
            const Icon = entry.icon;
            const content = (
              <>
                <Icon className="text-ink-400 h-4 w-4 shrink-0" aria-hidden="true" />
                {entry.label}
              </>
            );

            return (
              <li key={entry.id} role="none">
                {index === 2 && <span aria-hidden="true" className="bg-line my-1.5 block h-px" />}
                {entry.to ? (
                  <Link
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    role="menuitem"
                    to={entry.to}
                    onClick={() => close(false)}
                    className={itemClass}
                  >
                    {content}
                  </Link>
                ) : (
                  <button
                    ref={(node) => {
                      itemRefs.current[index] = node;
                    }}
                    role="menuitem"
                    type="button"
                    onClick={() => {
                      close(false);
                      openQuote();
                    }}
                    className={cn(itemClass, 'cursor-pointer')}
                  >
                    {content}
                  </button>
                )}
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
