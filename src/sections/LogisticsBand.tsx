import {
  ArrowUpRight,
  Clock,
  MapPin,
  MapPinned,
  PackageCheck,
  Phone,
  Timer,
  type LucideIcon,
} from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { ButtonAnchor, ButtonLink } from '../components/ui/Button';
import { CountUp } from '../components/ui/CountUp';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { branches, deliveryStats } from '../data/institutional';

const statIcons: Record<string, LucideIcon> = {
  entrega: Timer,
  cobertura: MapPinned,
  fill: PackageCheck,
};

const mapsHref = (query: string) =>
  `https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(query)}`;

export function LogisticsBand() {
  return (
    <Section tone="canvas" padding="lg" aria-labelledby="logistica-title">
      <SectionHeading
        id="logistica-title"
        eyebrow="Cobertura y logística"
        title="Surtimos desde dos centros de distribución"
        description="Ruta propia en zona metropolitana, paquetería nacional en el resto del país y salida el mismo día para todo pedido confirmado antes de las 14:00."
        action={
          <ButtonLink to="/contacto" variant="outline" size="md">
            Ver sucursales
          </ButtonLink>
        }
      />

      <ul className="mt-12 grid gap-4 sm:grid-cols-3">
        {deliveryStats.map((stat, index) => {
          const Icon = statIcons[stat.id] ?? PackageCheck;

          return (
            <Reveal
              as="li"
              key={stat.id}
              delay={index * 80}
              className="bg-surface rounded-panel ring-ink-900/[0.05] p-6 shadow-[var(--shadow-e1)] ring-1"
            >
              <Icon aria-hidden="true" className="text-brand-500 h-5 w-5" />
              <p className="font-display text-display-md text-ink-900 mt-4 font-medium tabular-nums">
                {stat.prefix}
                <CountUp value={stat.value} />
                {stat.suffix}
              </p>
              <p className="text-ink-900 mt-2 text-sm font-semibold">{stat.label}</p>
              <p className="text-ink-600 mt-1.5 text-sm leading-relaxed">{stat.detail}</p>
            </Reveal>
          );
        })}
      </ul>

      <div aria-hidden="true" className="rule-fade my-14" />

      <Reveal className="flex flex-wrap items-end justify-between gap-x-8 gap-y-3">
        <h3 className="font-display text-display-sm text-ink-900 font-medium">
          Sucursales y horarios
        </h3>
        <p className="text-ink-500 text-sm">
          Mostrador mayorista y recolección el mismo día en las tres.
        </p>
      </Reveal>

      <ul className="mt-8 grid gap-4 lg:grid-cols-3">
        {branches.map((branch, index) => (
          <Reveal as="li" key={branch.id} delay={index * 80} className="h-full">
            <div className="bg-surface rounded-panel ring-ink-900/[0.05] flex h-full flex-col p-6 shadow-[var(--shadow-e1)] ring-1 transition-[transform,translate,scale,rotate,box-shadow] duration-250 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[var(--shadow-e2)]">
              {/* Fixed-height overline keeps the three cards typographically aligned. */}
              <div className="flex h-6 items-center">
                {branch.distributionCenter ? (
                  <Badge tone="gold">Centro de distribución</Badge>
                ) : (
                  <span className="eyebrow text-ink-500">Sucursal y mostrador</span>
                )}
              </div>

              <h4 className="font-display text-display-sm text-ink-900 mt-4 font-medium">
                {branch.city}
              </h4>
              <p className="text-ink-500 mt-1 text-xs tracking-[0.12em] uppercase">
                {branch.state}
              </p>

              <ul className="border-line mt-5 flex flex-col gap-3 border-t pt-5 text-sm">
                <li className="flex items-start gap-3">
                  <MapPin aria-hidden="true" className="text-ink-500 mt-0.5 h-4 w-4 shrink-0" />
                  <span className="text-ink-600 leading-relaxed">{branch.address}</span>
                </li>
                <li className="flex items-center gap-3">
                  <Phone aria-hidden="true" className="text-ink-500 h-4 w-4 shrink-0" />
                  <a
                    href={`tel:${branch.phone.replace(/\s/g, '')}`}
                    className="text-ink-800 hover:text-brand-600 -my-3 py-3 font-medium tabular-nums transition-colors duration-200 ease-[var(--ease-out-quint)]"
                  >
                    {branch.phone}
                  </a>
                </li>
                <li className="flex items-start gap-3">
                  <Clock aria-hidden="true" className="text-ink-500 mt-0.5 h-4 w-4 shrink-0" />
                  <span className="text-ink-600 leading-relaxed">{branch.hours}</span>
                </li>
              </ul>

              <div className="mt-auto pt-6">
                <ButtonAnchor
                  href={mapsHref(`Buda Belleza, ${branch.address}, ${branch.city}`)}
                  target="_blank"
                  rel="noreferrer"
                  variant="ghost"
                  size="md"
                  className="-ml-6"
                >
                  Cómo llegar
                  <span className="sr-only"> a la sucursal {branch.city}</span>
                  <ArrowUpRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-0.5 group-hover/btn:-translate-y-0.5"
                  />
                </ButtonAnchor>
              </div>
            </div>
          </Reveal>
        ))}
      </ul>
    </Section>
  );
}
