import { BadgeCheck } from 'lucide-react';
import { Badge } from '../components/ui/Badge';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SmartImage } from '../components/ui/SmartImage';
import { certifications, testimonials } from '../data/institutional';

export function Testimonials() {
  return (
    <Section tone="blush" padding="lg" aria-labelledby="clientes-title">
      <SectionHeading
        align="center"
        id="clientes-title"
        eyebrow="Clientes desde 2007"
        title="Lo que dicen los negocios que abastecemos"
        description="Salones, barberías y estudios que llevan años resurtiendo con nosotros cada semana."
      />

      <ul className="mt-12 grid gap-5 lg:grid-cols-2">
        {testimonials.map((testimonial, index) => (
          <Reveal as="li" key={testimonial.id} delay={index * 80} className="h-full">
            <figure className="bg-surface/85 rounded-panel-lg ring-brand-900/[0.06] flex h-full flex-col gap-6 p-7 shadow-[var(--shadow-e1)] ring-1 backdrop-blur-sm transition-[transform,translate,scale,rotate,box-shadow] duration-250 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[var(--shadow-e2)] sm:p-8">
              <div>
                <span
                  aria-hidden="true"
                  className="font-display text-brand-200 block text-6xl leading-none"
                >
                  &ldquo;
                </span>
                <blockquote className="text-lead text-ink-800 mt-1">
                  <p>{testimonial.quote}</p>
                </blockquote>
              </div>

              <figcaption className="border-line mt-auto flex flex-wrap items-center gap-x-4 gap-y-3 border-t pt-6">
                <SmartImage
                  id={testimonial.avatarId}
                  alt=""
                  width={96}
                  height={96}
                  faces
                  sizes="48px"
                  wrapperClassName="ring-ink-900/10 h-12 w-12 shrink-0 rounded-full ring-1"
                />
                {/* The min width forces the badge onto its own line before the name can squash. */}
                <div className="min-w-[9rem] flex-1">
                  <p className="text-ink-900 font-semibold">{testimonial.author}</p>
                  <p className="text-ink-600 text-sm">
                    {testimonial.role} · {testimonial.business}
                  </p>
                  <p className="text-ink-500 mt-0.5 text-xs">{testimonial.city}</p>
                </div>
                <Badge tone="outline" className="ml-auto shrink-0">
                  {testimonial.yearsAsClient} años como cliente
                </Badge>
              </figcaption>
            </figure>
          </Reveal>
        ))}
      </ul>

      <Reveal delay={120} className="mt-14">
        <ul className="flex flex-wrap items-center justify-center gap-y-3">
          {certifications.map((certification, index) => (
            <li key={certification} className="flex items-center">
              {index > 0 && (
                <span
                  aria-hidden="true"
                  className="bg-brand-900/10 mx-2 hidden h-4 w-px sm:block"
                />
              )}
              <span className="bg-surface/70 ring-brand-900/[0.08] text-ink-600 mx-1 inline-flex items-center gap-2 rounded-full px-3.5 py-2 text-xs font-medium ring-1 backdrop-blur-sm">
                <BadgeCheck aria-hidden="true" className="text-brand-500 h-3.5 w-3.5 shrink-0" />
                {certification}
              </span>
            </li>
          ))}
        </ul>
      </Reveal>
    </Section>
  );
}
