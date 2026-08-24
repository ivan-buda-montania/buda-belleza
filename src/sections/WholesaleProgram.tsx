import {
  ArrowRight,
  ClipboardList,
  Download,
  FileText,
  ShieldCheck,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SmartImage } from '../components/ui/SmartImage';
import { processSteps } from '../data/institutional';
import { IMG } from '../lib/images';

/** The data layer stores the lucide icon by name; resolve it against what this section uses. */
const stepIcons: Record<string, LucideIcon> = {
  ClipboardList,
  ShieldCheck,
  FileText,
  Truck,
};

export function WholesaleProgram() {
  return (
    <Section tone="ink" padding="lg" className="grain" aria-labelledby="programa-title">
      <div className="relative z-10 grid gap-12 lg:grid-cols-12 lg:gap-16">
        <div className="lg:col-span-6">
          <SectionHeading
            onDark
            id="programa-title"
            eyebrow="Programa mayorista"
            title="Cómo comprar al mayoreo con nosotros"
            description="Cuatro pasos, sin intermediarios y con precios en firme desde el primer pedido. Es el mismo camino que recorrieron los salones, barberías y estudios que hoy resurten con nosotros cada semana."
          />

          <div className="relative mt-12">
            <span aria-hidden="true" className="absolute top-2 bottom-2 left-6 w-px bg-white/10" />
            <ol className="flex flex-col gap-9">
              {processSteps.map((step, index) => {
                const Icon = stepIcons[step.icon] ?? ClipboardList;

                return (
                  <Reveal as="li" key={step.id} delay={index * 90} className="flex gap-5 sm:gap-6">
                    <div className="bg-ink-950 relative z-10 flex w-12 shrink-0 flex-col items-center gap-3 py-1">
                      <span className="font-display text-display-sm text-gold-400 leading-none tabular-nums">
                        {step.step}
                      </span>
                      <span aria-hidden="true" className="bg-gold-400/50 h-px w-5" />
                      <Icon aria-hidden="true" className="text-gold-300/80 h-5 w-5" />
                    </div>
                    <div className="pt-0.5">
                      <h3 className="text-base font-semibold text-white sm:text-lg">
                        {step.title}
                      </h3>
                      <p className="text-ink-300 mt-2 text-sm leading-relaxed">
                        {step.description}
                      </p>
                    </div>
                  </Reveal>
                );
              })}
            </ol>
          </div>

          <Reveal delay={380} className="mt-11 flex flex-wrap items-center gap-3">
            <ButtonLink to="/mayoristas" size="lg">
              Registrar mi negocio
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
              />
            </ButtonLink>
            <ButtonLink to="/mayoristas" variant="outlineOnDark" size="lg">
              Descargar lista de precios
              <Download aria-hidden="true" className="h-4 w-4" />
            </ButtonLink>
          </Reveal>
        </div>

        <Reveal delay={140} y={24} className="relative lg:col-span-6">
          <div
            aria-hidden="true"
            className="pointer-events-none absolute -inset-10 bg-[radial-gradient(55%_50%_at_65%_28%,rgba(209,52,138,0.34),transparent_70%)] blur-2xl"
          />

          {/* Bottom padding reserves room for the offset image so the panel never overflows. */}
          <div className="relative sm:pb-20">
            <SmartImage
              id={IMG.teamAdvisors}
              alt="Asesoras comerciales de Buda Belleza revisando un pedido mayorista en el mostrador"
              width={1000}
              height={1250}
              sizes="(min-width: 1024px) 44vw, 92vw"
              wrapperClassName="rounded-panel-lg aspect-[4/3] w-full ring-1 ring-white/10 shadow-[var(--shadow-e4)] sm:aspect-[4/5]"
            />

            <div className="absolute bottom-0 left-0 hidden w-40 sm:block lg:w-48">
              <SmartImage
                id={IMG.warehouseLineup}
                alt="Anaquel del centro de distribución con producto profesional listo para surtir"
                width={480}
                height={360}
                sizes="12rem"
                wrapperClassName="rounded-panel ring-ink-950 aspect-[4/3] w-full ring-4 shadow-[var(--shadow-e3)]"
              />
            </div>

            <div className="bg-ink-900/70 rounded-card absolute top-5 right-5 px-4 py-3 text-right ring-1 ring-white/15 backdrop-blur-md">
              <p className="font-display text-display-sm leading-none text-white tabular-nums">
                24 h
              </p>
              <p className="eyebrow text-ink-200 mt-1.5">Surtido de pedido</p>
            </div>
          </div>
        </Reveal>
      </div>
    </Section>
  );
}
