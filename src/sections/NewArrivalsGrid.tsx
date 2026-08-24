import { ArrowRight, ChevronDown, Clock } from 'lucide-react';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button, ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { formatInteger } from '../lib/format';
import { getNewArrivals } from '../data/products';

const PAGE_SIZE = 8;

export function NewArrivalsGrid() {
  const newArrivals = useMemo(() => getNewArrivals(), []);
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);
  const closingRef = useRef<HTMLParagraphElement>(null);
  const shouldFocusClosing = useRef(false);

  const total = newArrivals.length;
  const visibleProducts = newArrivals.slice(0, visibleCount);
  const hasMore = visibleCount < total;

  // The "cargar más" button unmounts once the list is exhausted — move focus instead of losing it.
  useEffect(() => {
    if (!shouldFocusClosing.current) return;
    shouldFocusClosing.current = false;
    if (!hasMore) closingRef.current?.focus();
  }, [visibleCount, hasMore]);

  function loadMore() {
    shouldFocusClosing.current = true;
    setVisibleCount((count) => Math.min(count + PAGE_SIZE, total));
  }

  return (
    <Section tone="canvas" padding="lg" aria-labelledby="nuevos-title">
      <SectionHeading
        id="nuevos-title"
        eyebrow="Ingresos recientes"
        title="Lo más nuevo en Buda Belleza"
        description="Resurtimos cada semana. Aquí aparece lo que acaba de llegar a nuestros almacenes, con precio mayorista desde 6 piezas y existencia confirmada."
        action={
          <ButtonLink to="/catalogo" variant="outline" size="sm">
            Ver catálogo por categoría
          </ButtonLink>
        }
      />

      <Reveal
        y={12}
        className="border-line mt-10 flex flex-wrap items-center justify-between gap-x-8 gap-y-2 border-t pt-4"
      >
        <p className="text-ink-500 text-sm">
          Mostrando{' '}
          <span className="text-ink-900 font-semibold tabular-nums">
            {formatInteger(visibleProducts.length)}
          </span>{' '}
          de <span className="text-ink-900 font-semibold tabular-nums">{formatInteger(total)}</span>{' '}
          referencias
        </p>
        <p className="text-ink-500 inline-flex items-center gap-2 text-sm">
          <Clock aria-hidden="true" className="h-4 w-4" />
          Ordenadas por ingreso más reciente
        </p>
      </Reveal>

      <ProductGrid
        products={visibleProducts}
        columns={4}
        className="mt-8"
        emptyMessage="Estamos cargando los ingresos de esta semana."
      />

      <p aria-live="polite" className="sr-only">
        Mostrando {formatInteger(visibleProducts.length)} de {formatInteger(total)} referencias
        nuevas.
      </p>

      <div className="mt-12 flex flex-col items-center gap-5">
        {hasMore ? (
          <Button variant="outline" size="lg" onClick={loadMore}>
            Cargar más referencias
            <ChevronDown
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-y-0.5"
            />
          </Button>
        ) : (
          <>
            <span aria-hidden="true" className="rule-fade block w-full max-w-sm" />
            <p ref={closingRef} tabIndex={-1} className="text-ink-500 text-center text-sm">
              Ya viste las {formatInteger(total)} referencias que ingresaron esta semana.
            </p>
            <ButtonLink to="/catalogo" variant="primary" size="lg">
              Ver el catálogo completo
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-0.5"
              />
            </ButtonLink>
          </>
        )}
      </div>
    </Section>
  );
}
