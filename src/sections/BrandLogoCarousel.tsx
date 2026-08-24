import { Fragment } from 'react';
import { BrandWordmark } from '../components/ui/BrandWordmark';
import { ButtonLink } from '../components/ui/Button';
import { Marquee } from '../components/ui/Marquee';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import type { Brand } from '../types/brand';

interface BrandLogoCarouselProps {
  brands: Brand[];
}

const guarantees = [
  'Distribución autorizada',
  'Producto 100% original',
  'Factura CFDI 4.0',
] as const;

function BrandRow({ brands }: BrandLogoCarouselProps) {
  return (
    <ul className="flex items-center gap-4 py-2 pr-4">
      {brands.map((brand) => (
        <li
          key={brand.id}
          className="group/chip bg-surface ring-ink-900/[0.06] hover:ring-brand-200 inline-flex items-center gap-3 rounded-full px-7 py-4 shadow-[var(--shadow-e1)] ring-1 transition-[box-shadow] duration-300 ease-[var(--ease-out-quint)] hover:shadow-[var(--shadow-e2)]"
        >
          <BrandWordmark
            brand={brand}
            className="text-ink-700 group-hover/chip:text-ink-900 transition-colors duration-300 ease-[var(--ease-out-quint)]"
          />
          {brand.exclusive && (
            <span className="eyebrow text-gold-600 inline-flex items-center gap-1.5">
              <span aria-hidden="true" className="bg-gold-400 h-1.5 w-1.5 rounded-full" />
              Exclusiva
            </span>
          )}
        </li>
      ))}
    </ul>
  );
}

export function BrandLogoCarousel({ brands }: BrandLogoCarouselProps) {
  // Each row carries the full portfolio (the second one reversed) so the track always
  // overflows the container — half a portfolio leaves a visible gap on wide screens.
  const topRow = brands;
  const bottomRow = [...brands].reverse();

  return (
    <Section tone="canvas" padding="lg" aria-labelledby="marcas-title">
      <SectionHeading
        id="marcas-title"
        eyebrow="Portafolio"
        title="82 marcas nacionales e importadas"
        description="Seis distribuciones exclusivas para México, capacitación técnica con los educadores de cada casa y reposición garantizada de las líneas de mayor rotación."
        action={
          <ButtonLink to="/marcas" variant="outline">
            Conocer el portafolio
          </ButtonLink>
        }
      />

      {/* gap-0 between the two duplicated tracks keeps the -50% loop seamless; the visual
          rhythm comes from the row's own gap plus its trailing padding. */}
      <div className="mt-10 flex flex-col gap-y-4">
        <Marquee gapClassName="gap-0">
          <BrandRow brands={topRow} />
        </Marquee>
        <Marquee gapClassName="gap-0" speed="slow" reverse>
          <BrandRow brands={bottomRow} />
        </Marquee>
      </div>

      <Reveal
        delay={120}
        className="text-ink-500 mt-10 flex flex-wrap items-center justify-center gap-x-4 gap-y-2 text-sm"
      >
        {guarantees.map((item, index) => (
          <Fragment key={item}>
            {index > 0 && (
              <span aria-hidden="true" className="bg-line-strong hidden h-3 w-px sm:block" />
            )}
            <span>{item}</span>
          </Fragment>
        ))}
      </Reveal>
    </Section>
  );
}
