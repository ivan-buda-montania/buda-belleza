import { useMemo, useState } from 'react';
import { Carousel } from '../components/carousel/Carousel';
import { ProductCard } from '../components/product/ProductCard';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { getBestSellers, getNewArrivals, getVolumeOffers } from '../data/products';
import {
  QUICK_FILTER_PANEL_ID,
  QuickFilterButtons,
  quickFilterTabId,
  type QuickFilter,
} from './QuickFilterButtons';

interface FilterCopy {
  note: string;
  carouselLabel: string;
}

const filterCopy: Record<QuickFilter, FilterCopy> = {
  bestseller: {
    note: 'Los SKUs con mayor reposición en los últimos 90 días.',
    carouselLabel: 'Carrusel de productos más vendidos',
  },
  new: {
    note: 'Referencias que acaban de entrar a piso en CDMX y Monterrey, con inventario reservado para cabina.',
    carouselLabel: 'Carrusel de nuevos ingresos',
  },
  'volume-offer': {
    note: 'Precio escalonado desde 6 piezas por SKU: el descuento se aplica solo al armar tu cotización.',
    carouselLabel: 'Carrusel de ofertas por volumen',
  },
};

export function BestSellersCarousel() {
  const [activeFilter, setActiveFilter] = useState<QuickFilter>('bestseller');

  const collections = useMemo(
    () => ({
      bestseller: getBestSellers(),
      new: getNewArrivals(),
      'volume-offer': getVolumeOffers(),
    }),
    [],
  );

  const counts = useMemo(
    () => ({
      bestseller: collections.bestseller.length,
      new: collections.new.length,
      'volume-offer': collections['volume-offer'].length,
    }),
    [collections],
  );

  const items = collections[activeFilter];
  const copy = filterCopy[activeFilter];

  return (
    <Section tone="surface" padding="lg" aria-labelledby="destacados-title">
      <SectionHeading
        id="destacados-title"
        eyebrow="Selección de temporada"
        title="Lo que más rota en cabina"
        description="La lectura de nuestros centros de distribución: las líneas que salones, barberías y estudios de uñas vuelven a pedir mes con mes."
        action={
          <ButtonLink to="/catalogo" variant="outline" size="sm">
            Ver todo el catálogo
          </ButtonLink>
        }
      />

      <div className="mt-8 flex flex-col gap-3.5">
        <Reveal y={12}>
          <QuickFilterButtons active={activeFilter} onChange={setActiveFilter} counts={counts} />
        </Reveal>
        <p key={activeFilter} className="animate-fade-up text-ink-500 max-w-2xl text-sm">
          {copy.note}
        </p>
      </div>

      <div
        id={QUICK_FILTER_PANEL_ID}
        role="tabpanel"
        aria-labelledby={quickFilterTabId(activeFilter)}
        className="mt-8 sm:mt-10"
      >
        {items.length > 0 ? (
          <Carousel
            key={activeFilter}
            slideClassName="w-[72%] sm:w-[46%] lg:w-[31%] xl:w-[23.5%]"
            ariaLabel={copy.carouselLabel}
            controlsPlacement="outside"
            showProgress
          >
            {items.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </Carousel>
        ) : (
          <div className="rounded-panel border-line-strong border border-dashed px-6 py-14 text-center">
            <p className="text-ink-600 mx-auto max-w-md text-sm">
              Esta selección se está actualizando con el inventario de la semana. Escríbenos y un
              asesor te comparte la disponibilidad del día.
            </p>
            <ButtonLink to="/catalogo" variant="outline" size="sm" className="mt-5">
              Explorar el catálogo
            </ButtonLink>
          </div>
        )}
      </div>
    </Section>
  );
}
