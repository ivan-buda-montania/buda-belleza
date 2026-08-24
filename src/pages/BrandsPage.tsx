import { ArrowRight, BadgeCheck, Boxes, GraduationCap, MapPin } from 'lucide-react';
import { useEffect, useMemo, useState } from 'react';
import { Badge } from '../components/ui/Badge';
import { BrandWordmark } from '../components/ui/BrandWordmark';
import { Button, ButtonLink } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { brands, exclusiveBrands } from '../data/brands';
import { products } from '../data/products';
import { cn } from '../lib/cn';
import { formatInteger } from '../lib/format';

const ALL = 'todas';

const productCountByBrand = products.reduce<Record<string, number>>((counts, product) => {
  counts[product.brandId] = (counts[product.brandId] ?? 0) + 1;
  return counts;
}, {});

const brandCountByOrigin = brands.reduce<Record<string, number>>((counts, brand) => {
  counts[brand.origin] = (counts[brand.origin] ?? 0) + 1;
  return counts;
}, {});

const origins = Object.keys(brandCountByOrigin).sort((a, b) => a.localeCompare(b, 'es'));

const headerStats = [
  { id: 'marcas', label: 'Marcas publicadas', value: brands.length },
  { id: 'exclusivas', label: 'En exclusiva nacional', value: exclusiveBrands.length },
  { id: 'origenes', label: 'Países de origen', value: origins.length },
];

const criteria = [
  {
    id: 'originalidad',
    icon: BadgeCheck,
    title: 'Originalidad comprobable',
    description:
      'Compramos directo al fabricante o a su representante legal en México. Cada lote llega con su documentación y su garantía de origen.',
  },
  {
    id: 'respaldo',
    icon: GraduationCap,
    title: 'Respaldo técnico real',
    description:
      'Una marca entra al portafolio solo si su equipo técnico capacita a nuestros clientes y responde por el desempeño del producto en cabina.',
  },
  {
    id: 'disponibilidad',
    icon: Boxes,
    title: 'Disponibilidad sostenida',
    description:
      'Listamos únicamente lo que podemos resurtir todo el año. Si una marca no sostiene el abasto, sale del catálogo.',
  },
];

export function BrandsPage() {
  const [origin, setOrigin] = useState<string>(ALL);
  const [onlyExclusive, setOnlyExclusive] = useState(false);

  useEffect(() => {
    document.title = 'Marcas — Buda Belleza';
  }, []);

  const visibleBrands = useMemo(
    () =>
      brands.filter(
        (brand) =>
          (origin === ALL || brand.origin === origin) && (!onlyExclusive || brand.exclusive),
      ),
    [origin, onlyExclusive],
  );

  const resetFilters = () => {
    setOrigin(ALL);
    setOnlyExclusive(false);
  };

  return (
    <>
      <Section tone="ink" padding="md" className="grain" aria-labelledby="marcas-title">
        <div className="relative z-10">
          <Reveal className="flex max-w-3xl flex-col gap-5">
            <Eyebrow tone="onDark">Portafolio</Eyebrow>
            <h1 id="marcas-title" className="font-display text-display-xl font-medium text-white">
              Las marcas que decidimos representar
            </h1>
            <p className="text-lead text-ink-300">
              No distribuimos todo lo que existe: distribuimos lo que podemos garantizar. Cada línea
              del portafolio pasó por prueba en cabina, revisión de abasto y acuerdo directo con el
              fabricante.
            </p>
          </Reveal>

          <Reveal delay={120} className="mt-10">
            <dl className="flex flex-wrap gap-x-14 gap-y-7 border-t border-white/10 pt-8">
              {headerStats.map((stat) => (
                <div key={stat.id} className="flex flex-col-reverse gap-2">
                  <dt className="eyebrow text-ink-300">{stat.label}</dt>
                  <dd className="font-display text-display-md leading-none text-white tabular-nums">
                    {stat.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      <Section tone="canvas" padding="lg" aria-labelledby="portafolio-title">
        <h2 id="portafolio-title" className="sr-only">
          Marcas disponibles
        </h2>

        <Reveal className="border-line flex flex-col gap-6 border-b pb-8 lg:flex-row lg:items-center lg:justify-between">
          <div
            role="group"
            aria-label="Filtrar marcas por país de origen"
            className="flex flex-wrap gap-2"
          >
            {[ALL, ...origins].map((value) => {
              const isActive = origin === value;
              const label = value === ALL ? 'Todas' : value;
              const count = value === ALL ? brands.length : (brandCountByOrigin[value] ?? 0);

              return (
                <button
                  key={value}
                  type="button"
                  aria-pressed={isActive}
                  onClick={() => setOrigin(value)}
                  className={cn(
                    'inline-flex h-11 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium transition-[background-color,color,box-shadow] duration-250 ease-[var(--ease-out-quint)]',
                    isActive
                      ? 'bg-ink-900 text-white shadow-[var(--shadow-e2)]'
                      : 'bg-surface text-ink-700 ring-line hover:text-ink-900 hover:ring-line-strong ring-1',
                  )}
                >
                  {label}
                  <span className={cn('tabular-nums', isActive ? 'text-ink-300' : 'text-ink-400')}>
                    {count}
                  </span>
                </button>
              );
            })}
          </div>

          <button
            type="button"
            role="switch"
            aria-checked={onlyExclusive}
            onClick={() => setOnlyExclusive((previous) => !previous)}
            className="text-ink-700 hover:text-ink-900 inline-flex h-11 shrink-0 cursor-pointer items-center gap-3 self-start rounded-full text-sm font-medium transition-colors duration-200 ease-[var(--ease-out-quint)] lg:self-auto"
          >
            <span
              aria-hidden="true"
              className={cn(
                'relative h-6 w-11 shrink-0 rounded-full transition-colors duration-250 ease-[var(--ease-out-quint)]',
                onlyExclusive ? 'bg-brand-600' : 'bg-ink-300',
              )}
            >
              <span
                className={cn(
                  'absolute top-0.5 left-0.5 h-5 w-5 rounded-full bg-white shadow-[var(--shadow-e1)] transition-transform duration-250 ease-[var(--ease-out-quint)]',
                  onlyExclusive && 'translate-x-5',
                )}
              />
            </span>
            Solo exclusivas
          </button>
        </Reveal>

        <p aria-live="polite" className="text-ink-500 mt-6 text-sm">
          {visibleBrands.length === brands.length
            ? `${brands.length} marcas publicadas de un portafolio de 82`
            : `${visibleBrands.length} de ${brands.length} marcas`}
        </p>

        {visibleBrands.length === 0 ? (
          <Reveal className="mt-8">
            <div className="border-line-strong rounded-panel bg-surface/60 border border-dashed px-6 py-16 text-center">
              <p className="font-display text-display-sm text-ink-900 font-medium">
                No hay marcas con esa combinación
              </p>
              <p className="text-ink-600 mx-auto mt-3 max-w-sm text-sm leading-relaxed">
                Todavía no representamos una marca exclusiva de {origin}. Quita algún filtro para
                ver el resto del portafolio.
              </p>
              <Button variant="outline" onClick={resetFilters} className="mt-7">
                Ver todas las marcas
              </Button>
            </div>
          </Reveal>
        ) : (
          <ul className="mt-8 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {visibleBrands.map((brand, index) => {
              const count = productCountByBrand[brand.id] ?? 0;

              return (
                <Reveal
                  as="li"
                  key={brand.id}
                  delay={Math.min(index, 6) * 60}
                  className="h-full"
                  y={16}
                >
                  <article className="bg-surface rounded-panel ring-ink-900/[0.05] flex h-full flex-col p-6 shadow-[var(--shadow-e1)] ring-1 transition-[transform,translate,scale,rotate,box-shadow] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)] sm:p-7">
                    <div className="flex min-h-14 flex-wrap items-start justify-between gap-x-4 gap-y-2">
                      <h3>
                        <BrandWordmark brand={brand} className="text-ink-900" />
                      </h3>
                      {brand.exclusive && <Badge tone="gold">Exclusiva</Badge>}
                    </div>

                    <div aria-hidden="true" className="rule-fade mt-5" />

                    <p className="eyebrow text-ink-500 mt-5 flex items-center gap-1.5">
                      <MapPin aria-hidden="true" className="h-3.5 w-3.5" />
                      {brand.origin}
                    </p>
                    <p className="text-ink-600 mt-3 text-sm leading-relaxed">{brand.note}</p>

                    <div className="border-line mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 border-t pt-6">
                      <p className="text-ink-500 text-xs tabular-nums">
                        {formatInteger(count)} productos
                      </p>
                      <ButtonLink
                        to={`/catalogo?marca=${brand.id}`}
                        variant="subtle"
                        size="sm"
                        aria-label={`Ver productos de ${brand.name}`}
                      >
                        Ver productos
                        <ArrowRight
                          aria-hidden="true"
                          className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
                        />
                      </ButtonLink>
                    </div>
                  </article>
                </Reveal>
              );
            })}
          </ul>
        )}
      </Section>

      <Section tone="sunken" padding="lg" aria-labelledby="criterios-title">
        <SectionHeading
          id="criterios-title"
          eyebrow="Criterio de selección"
          title="Cómo entra una marca a este catálogo"
          description="Tres filtros que aplicamos antes de firmar cualquier acuerdo de distribución."
        />

        <ul className="mt-12 grid gap-8 md:grid-cols-3 md:gap-10">
          {criteria.map((criterion, index) => (
            <Reveal as="li" key={criterion.id} delay={index * 80}>
              <span
                aria-hidden="true"
                className="bg-surface text-brand-600 ring-line grid h-12 w-12 place-items-center rounded-full ring-1"
              >
                <criterion.icon className="h-5 w-5" />
              </span>
              <h3 className="text-ink-900 mt-6 text-base font-semibold">{criterion.title}</h3>
              <p className="text-ink-600 mt-2.5 text-sm leading-relaxed">{criterion.description}</p>
            </Reveal>
          ))}
        </ul>

        <Reveal delay={220} className="mt-14">
          <div className="bg-surface rounded-panel ring-ink-900/[0.05] flex flex-col gap-6 p-7 shadow-[var(--shadow-e1)] ring-1 sm:p-9 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl">
              <h3 className="font-display text-display-sm text-ink-900 font-medium">
                ¿Representas una marca?
              </h3>
              <p className="text-ink-600 mt-2.5 text-sm leading-relaxed">
                Si buscas distribución en México con cobertura en 31 estados y equipo comercial
                propio, mándanos tu portafolio y tus condiciones. Contestamos todas las propuestas.
              </p>
            </div>
            <ButtonLink to="/contacto" size="lg" className="shrink-0">
              Proponer distribución
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
              />
            </ButtonLink>
          </div>
        </Reveal>
      </Section>
    </>
  );
}
