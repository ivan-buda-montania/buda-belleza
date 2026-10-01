import { ArrowRight, BadgeCheck, Boxes, GraduationCap } from 'lucide-react';
import { useEffect } from 'react';
import { BrandWordmark } from '../components/ui/BrandWordmark';
import { ButtonLink } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { brands } from '../data/brands';
import { formatInteger, formatReferences } from '../lib/format';

const headerStats = [
  { id: 'marcas', label: 'Marcas publicadas', value: brands.length },
  {
    id: 'referencias',
    label: 'Referencias de estas marcas',
    value: brands.reduce((total, brand) => total + brand.productCount, 0),
  },
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
  useEffect(() => {
    document.title = 'Marcas — Buda Belleza';
  }, []);

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
                    {formatInteger(stat.value)}
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

        <ul className="grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {brands.map((brand, index) => (
            <Reveal
              as="li"
              key={brand.id}
              delay={Math.min(index, 6) * 60}
              className="h-full"
              y={16}
            >
              <article className="bg-surface rounded-panel ring-ink-900/[0.05] flex h-full flex-col p-6 shadow-[var(--shadow-e1)] ring-1 transition-[transform,translate,scale,rotate,box-shadow] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)] sm:p-7">
                <h3 className="flex min-h-14 items-start">
                  <BrandWordmark brand={brand} className="text-ink-900" />
                </h3>

                <div aria-hidden="true" className="rule-fade mt-5" />

                <div className="mt-auto flex flex-wrap items-center justify-between gap-x-4 gap-y-3 pt-6">
                  <p className="text-ink-500 text-xs tabular-nums">
                    {formatReferences(brand.productCount)}
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
          ))}
        </ul>
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
