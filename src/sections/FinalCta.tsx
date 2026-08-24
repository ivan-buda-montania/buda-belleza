import { ArrowRight, ShieldCheck } from 'lucide-react';
import { ButtonLink } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';

const hairlineGrid =
  "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='80' height='80' fill='none'%3E%3Cpath d='M80 0H0v80' stroke='%23ffffff'/%3E%3C/svg%3E\")";

export function FinalCta() {
  return (
    <Section
      tone="brand"
      padding="lg"
      className="grain relative overflow-hidden"
      aria-labelledby="cta-title"
    >
      <div aria-hidden="true" className="pointer-events-none absolute inset-0">
        <div className="bg-brand-500/25 animate-float absolute -top-28 -left-24 h-[26rem] w-[26rem] rounded-full blur-3xl" />
        <div
          className="bg-gold-400/20 animate-float absolute -right-24 -bottom-32 h-[24rem] w-[24rem] rounded-full blur-3xl"
          style={{ animationDelay: '-3.2s' }}
        />
        <div
          className="absolute inset-0 opacity-[0.07]"
          style={{ backgroundImage: hairlineGrid }}
        />
      </div>

      <div className="relative z-10 mx-auto flex max-w-3xl flex-col items-center text-center">
        <Reveal>
          <Eyebrow tone="gold">Cuenta mayorista</Eyebrow>
        </Reveal>

        <Reveal delay={80} className="mt-5">
          <h2 id="cta-title" className="font-display text-display-xl font-medium text-white">
            Todo tu resurtido, con <span className="text-gradient-gold">un solo proveedor</span>
          </h2>
        </Reveal>

        <Reveal delay={160} className="mt-5">
          <p className="text-lead text-brand-100">
            Precio mayorista real desde 6 piezas, factura CFDI 4.0 y un asesor asignado que conoce
            tu inventario. Más de 3,200 negocios en 31 estados ya se abastecen así.
          </p>
        </Reveal>

        <Reveal delay={240} className="mt-9 flex flex-wrap items-center justify-center gap-3">
          <ButtonLink to="/mayoristas" variant="gold" size="lg">
            Registrarme como mayorista
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
            />
          </ButtonLink>
          <ButtonLink to="/contacto" variant="outlineOnDark" size="lg">
            Hablar con un asesor
          </ButtonLink>
        </Reveal>

        <Reveal delay={320} className="mt-7">
          <p className="text-brand-200 flex items-center justify-center gap-2 text-sm">
            <ShieldCheck aria-hidden="true" className="text-gold-300 h-4 w-4 shrink-0" />
            Alta validada en menos de 24 horas hábiles · Sin costo · Sin permanencia
          </p>
        </Reveal>
      </div>
    </Section>
  );
}
