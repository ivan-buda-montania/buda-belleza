import { Check, FileText, Minus, Plus, Trash2, X } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState } from 'react';
import { QUOTE_MINIMUM_MXN, useQuote, type QuoteLine } from '../../context/quote-store';
import { getBrandById } from '../../data/brands';
import { socialLinks } from '../../data/social-links';
import { cn } from '../../lib/cn';
import { formatInteger, formatPrice } from '../../lib/format';
import { WhatsAppIcon } from '../icons/SocialIcons';
import { ButtonAnchor, ButtonLink } from '../ui/Button';
import { SmartImage } from '../ui/SmartImage';

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), [tabindex]:not([tabindex="-1"])';

const whatsappBase =
  socialLinks.find((link) => link.id === 'whatsapp')?.href ?? 'https://wa.me/525543218800';

function buildWhatsappHref(lines: QuoteLine[], subtotal: number) {
  const body = [
    'Hola Buda Belleza, quiero cotizar el siguiente pedido mayorista:',
    '',
    ...lines.map((line) => `• ${line.product.sku} × ${line.quantity} pzas — ${line.product.name}`),
    '',
    `Subtotal estimado: ${formatPrice(subtotal)} (sin IVA ni envío)`,
  ].join('\n');

  return `${whatsappBase}?text=${encodeURIComponent(body)}`;
}

interface QuantityStepperProps {
  line: QuoteLine;
  onChange: (quantity: number) => void;
}

/**
 * Wholesale lines move in case multiples and can never fall below the order minimum.
 * The minus button disables itself once it reaches that floor, so it hands focus to
 * the plus button rather than dropping it on `<body>` inside a modal.
 */
function QuantityStepper({ line, onChange }: QuantityStepperProps) {
  const { product, quantity } = line;
  const step = product.price.minWholesaleQty ?? 6;
  const plusRef = useRef<HTMLButtonElement>(null);
  const [draft, setDraft] = useState<string | null>(null);
  const atMinimum = quantity <= step;

  const decrement = () => {
    const next = Math.max(step, quantity - step);
    onChange(next);
    if (next <= step) plusRef.current?.focus();
  };

  const commitDraft = () => {
    if (draft === null) return;
    const parsed = Number.parseInt(draft, 10);
    onChange(Number.isNaN(parsed) ? step : Math.max(step, parsed));
    setDraft(null);
  };

  return (
    <div className="border-line inline-flex items-center rounded-full border">
      <button
        type="button"
        onClick={decrement}
        disabled={atMinimum}
        aria-label={`Quitar ${step} piezas de ${product.name}`}
        className="text-ink-600 hover:text-brand-600 flex h-11 w-9 items-center justify-center rounded-l-full transition-colors duration-250 disabled:opacity-30"
      >
        <Minus className="h-4 w-4" aria-hidden="true" />
      </button>
      <input
        type="number"
        inputMode="numeric"
        min={step}
        step={step}
        value={draft ?? quantity}
        onChange={(event) => setDraft(event.target.value)}
        onBlur={commitDraft}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            commitDraft();
          }
        }}
        aria-label={`Cantidad de ${product.name} en piezas`}
        className="text-ink-900 h-11 w-11 [appearance:textfield] bg-transparent text-center text-sm font-semibold tabular-nums [&::-webkit-inner-spin-button]:appearance-none [&::-webkit-outer-spin-button]:appearance-none"
      />
      <button
        ref={plusRef}
        type="button"
        onClick={() => onChange(quantity + step)}
        aria-label={`Agregar ${step} piezas de ${product.name}`}
        className="text-ink-600 hover:text-brand-600 flex h-11 w-9 items-center justify-center rounded-r-full transition-colors duration-250"
      >
        <Plus className="h-4 w-4" aria-hidden="true" />
      </button>
    </div>
  );
}

export function QuoteDrawer() {
  const {
    lines,
    itemCount,
    totalUnits,
    subtotal,
    savings,
    isOpen,
    remove,
    setQuantity,
    clear,
    close,
  } = useQuote();

  const titleId = useId();
  const panelRef = useRef<HTMLDivElement>(null);
  const closeButtonRef = useRef<HTMLButtonElement>(null);

  // Emptying the list unmounts whatever button was clicked, so hand focus back
  // to the header rather than letting it fall out of the trapped panel.
  const focusClose = () => closeButtonRef.current?.focus();

  useEffect(() => {
    if (!isOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;

    closeButtonRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        close();
        return;
      }
      if (event.key !== 'Tab' || !panelRef.current) return;

      const focusable = Array.from(panelRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !panelRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !panelRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', onKeyDown);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previouslyFocused?.focus();
    };
  }, [isOpen, close]);

  const whatsappHref = useMemo(() => buildWhatsappHref(lines, subtotal), [lines, subtotal]);

  const missing = Math.max(0, QUOTE_MINIMUM_MXN - subtotal);
  const progress = Math.min(1, subtotal / QUOTE_MINIMUM_MXN);
  const minimumReached = missing === 0 && subtotal > 0;

  return (
    <>
      <div
        aria-hidden="true"
        onClick={close}
        className={cn(
          'bg-ink-950/50 fixed inset-0 z-[60] backdrop-blur-sm transition-opacity duration-300 ease-[var(--ease-out-quint)]',
          isOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        inert={!isOpen}
        className={cn(
          'bg-surface fixed inset-y-0 right-0 z-[70] flex w-full max-w-md flex-col',
          'lg:rounded-l-panel shadow-[var(--shadow-e4)]',
          'transition-[translate] duration-[320ms] ease-[var(--ease-out-quint)]',
          isOpen ? 'translate-x-0' : 'translate-x-full',
        )}
      >
        <header className="border-line flex items-start justify-between gap-4 border-b px-5 py-5 sm:px-6">
          <div className="min-w-0">
            <h2 id={titleId} className="font-display text-display-sm text-ink-900 font-medium">
              Tu cotización
            </h2>
            <p className="text-ink-500 mt-1 text-xs">
              {itemCount === 0
                ? 'Sin productos todavía'
                : `${itemCount} ${itemCount === 1 ? 'producto' : 'productos'} · ${formatInteger(totalUnits)} piezas`}
            </p>
          </div>
          <button
            ref={closeButtonRef}
            type="button"
            onClick={close}
            aria-label="Cerrar la cotización"
            className="text-ink-500 hover:bg-ink-100 hover:text-ink-900 -mr-2 flex h-11 w-11 shrink-0 items-center justify-center rounded-full transition-colors duration-250 ease-[var(--ease-out-quint)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </header>

        {lines.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center gap-4 px-8 text-center">
            <span className="bg-brand-50 text-brand-600 flex h-16 w-16 items-center justify-center rounded-full">
              <FileText className="h-7 w-7" aria-hidden="true" />
            </span>
            <p className="font-display text-display-sm text-ink-900 font-medium">
              Tu cotización está vacía
            </p>
            <p className="text-ink-500 max-w-xs text-sm leading-relaxed">
              Agrega productos desde el catálogo y arma tu pedido. Te respondemos con precios en
              firme el mismo día hábil.
            </p>
            <ButtonLink to="/catalogo" variant="primary" size="md" onClick={close} className="mt-2">
              Explorar el catálogo
            </ButtonLink>
          </div>
        ) : (
          <ul className="divide-line flex-1 divide-y overflow-y-auto px-5 sm:px-6">
            {lines.map((line) => {
              const { product, quantity } = line;
              const brand = getBrandById(product.brandId);

              return (
                <li key={product.id} className="flex gap-4 py-4">
                  <SmartImage
                    id={product.imageId}
                    alt={product.name}
                    width={72}
                    height={72}
                    sizes="72px"
                    wrapperClassName="h-18 w-18 shrink-0 rounded-[0.875rem]"
                  />

                  <div className="flex min-w-0 flex-1 flex-col gap-2">
                    <div className="min-w-0">
                      <span className="eyebrow text-ink-400 block">{brand?.name}</span>
                      <p className="text-ink-900 mt-1 line-clamp-2 text-sm leading-snug font-semibold">
                        {product.name}
                      </p>
                      <p className="text-ink-400 mt-0.5 text-xs">
                        {product.presentation} · {formatPrice(product.price.wholesale)} por pieza
                      </p>
                    </div>

                    <div className="flex flex-wrap items-center justify-between gap-x-2 gap-y-1">
                      <QuantityStepper
                        line={line}
                        onChange={(next) => setQuantity(product.id, next)}
                      />

                      <div className="flex items-center gap-0.5">
                        <span className="font-display text-ink-900 text-sm leading-none font-semibold tabular-nums">
                          {formatPrice(product.price.wholesale * quantity)}
                        </span>
                        <button
                          type="button"
                          onClick={() => {
                            remove(product.id);
                            focusClose();
                          }}
                          aria-label={`Quitar ${product.name} de la cotización`}
                          className="text-ink-400 hover:bg-danger-100 hover:text-danger-700 -mr-1 flex h-11 w-10 items-center justify-center rounded-full transition-colors duration-250 ease-[var(--ease-out-quint)]"
                        >
                          <Trash2 className="h-4 w-4" aria-hidden="true" />
                        </button>
                      </div>
                    </div>
                  </div>
                </li>
              );
            })}
          </ul>
        )}

        {lines.length > 0 && (
          <footer className="border-line bg-surface border-t px-5 py-5 sm:px-6">
            <div className="flex flex-col gap-2">
              <div
                role="progressbar"
                aria-label="Avance hacia el pedido mínimo"
                aria-valuemin={0}
                aria-valuemax={QUOTE_MINIMUM_MXN}
                aria-valuenow={Math.round(Math.min(subtotal, QUOTE_MINIMUM_MXN))}
                className="bg-ink-100 h-1.5 w-full overflow-hidden rounded-full"
              >
                <div
                  className="from-brand-600 to-gold-400 h-full origin-left rounded-full bg-gradient-to-r transition-transform duration-500 ease-[var(--ease-out-quint)]"
                  style={{ transform: `scaleX(${progress})` }}
                />
              </div>
              <p
                className={cn(
                  'flex items-center gap-1.5 text-xs font-medium',
                  minimumReached ? 'text-success-700' : 'text-ink-500',
                )}
              >
                {minimumReached && <Check className="h-3.5 w-3.5 shrink-0" aria-hidden="true" />}
                {minimumReached
                  ? 'Pedido mínimo alcanzado'
                  : `Te faltan ${formatPrice(missing)} para alcanzar el pedido mínimo`}
              </p>
            </div>

            <div className="border-line mt-4 flex items-baseline justify-between gap-3 border-t pt-4">
              <span className="eyebrow text-ink-400">Subtotal</span>
              <span className="font-display text-ink-900 text-2xl leading-none font-semibold tabular-nums">
                {formatPrice(subtotal)}
              </span>
            </div>

            {savings > 0 && (
              <p className="text-success-700 mt-1.5 text-right text-xs font-semibold tabular-nums">
                Ahorras {formatPrice(savings)} contra precio de lista
              </p>
            )}

            <p className="text-ink-400 mt-3 text-[0.6875rem] leading-relaxed">
              Los precios no incluyen IVA ni envío. Confirmamos existencias y flete al responder tu
              cotización.
            </p>

            <ButtonAnchor
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
              size="lg"
              className="mt-4 w-full px-4!"
            >
              <WhatsAppIcon className="h-5 w-5" aria-hidden="true" />
              Enviar cotización por WhatsApp
            </ButtonAnchor>

            <button
              type="button"
              onClick={() => {
                clear();
                focusClose();
              }}
              className="text-ink-400 hover:text-danger-700 mx-auto mt-2 flex h-11 items-center justify-center px-4 text-xs font-semibold transition-colors duration-250 ease-[var(--ease-out-quint)]"
            >
              Vaciar cotización
            </button>
          </footer>
        )}
      </div>
    </>
  );
}
