import {
  ArrowRight,
  CalendarClock,
  Check,
  CheckCircle2,
  ClipboardList,
  CreditCard,
  Download,
  FileText,
  GraduationCap,
  Headset,
  MessageCircle,
  PackageCheck,
  ShieldCheck,
  Tags,
  Truck,
  type LucideIcon,
} from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { FormField, type FieldChangeEvent } from '../components/forms/FormField';
import { Accordion } from '../components/ui/Accordion';
import { Badge } from '../components/ui/Badge';
import { Button, ButtonAnchor, ButtonLink } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { FREE_SHIPPING_MXN } from '../context/quote-store';
import { certifications, faqs, processSteps } from '../data/institutional';
import { socialLinks } from '../data/social-links';
import { cn } from '../lib/cn';
import { formatPrice } from '../lib/format';
import { buildWhatsappHref, whatsappMessages } from '../lib/whatsapp';

const whatsapp = socialLinks.find((link) => link.id === 'whatsapp');
const whatsappHandle = whatsapp?.handle ?? '+52 55 4321 8800';

const heroBenefits = [
  'Hasta 30% debajo del precio público, con descuento por SKU desde 6 piezas',
  'Crédito a 30 días a partir del cuarto pedido liquidado',
  'Un asesor asignado que te atiende por WhatsApp, sin conmutador',
  `Envío sin costo en pedidos desde ${formatPrice(FREE_SHIPPING_MXN)}`,
];

const benefits: { id: string; icon: LucideIcon; title: string; description: string }[] = [
  {
    id: 'precio',
    icon: Tags,
    title: 'Precio de distribuidor',
    description:
      'Lista mayorista propia, con descuento por SKU desde seis piezas y hasta 30% debajo del precio público sugerido.',
  },
  {
    id: 'credito',
    icon: CreditCard,
    title: 'Crédito a 30 días',
    description:
      'Después de tres pedidos liquidados en tiempo abrimos tu línea, sujeta a referencias comerciales.',
  },
  {
    id: 'asesor',
    icon: Headset,
    title: 'Asesor asignado',
    description:
      'Una sola persona conoce tu cuenta: cotiza, levanta el pedido y da seguimiento a la entrega.',
  },
  {
    id: 'capacitacion',
    icon: GraduationCap,
    title: 'Capacitación técnica sin costo',
    description:
      'Talleres de color, alisado y uñas con los técnicos de cada marca, en sucursal o en línea.',
  },
  {
    id: 'entregas',
    icon: CalendarClock,
    title: 'Entregas programadas',
    description:
      'Eliges el día de resurtido y tu asesor arma el pedido recurrente para que ningún servicio se frene.',
  },
  {
    id: 'apartado',
    icon: PackageCheck,
    title: 'Apartado de temporada',
    description:
      'Reserva decolorante, oxidante y material de alta rotación antes de diciembre y mayo; lo liberamos cuando lo pidas.',
  },
];

const tiers = [
  {
    id: 'tier-6',
    volume: '6 a 11 piezas',
    discount: '12%',
    credit: 'Contado o transferencia',
    delivery: 'Estándar · 2 a 4 días',
  },
  {
    id: 'tier-12',
    volume: '12 a 47 piezas',
    discount: '18%',
    credit: 'Contado o transferencia',
    delivery: 'Estándar · 2 a 4 días',
  },
  {
    id: 'tier-48',
    volume: '48 a 143 piezas',
    discount: '24%',
    credit: 'Crédito a 30 días',
    delivery: 'Prioritaria · 24 a 48 h',
    popular: true,
  },
  {
    id: 'tier-144',
    volume: '144+ o caja completa',
    discount: '30%',
    credit: 'Crédito a 30 días',
    delivery: 'Ruta propia sin costo',
  },
];

const requirements = [
  {
    id: 'rfc',
    title: 'RFC vigente',
    description:
      'Persona física con actividad empresarial o persona moral. Con él emitimos tu CFDI 4.0 en cada pedido.',
  },
  {
    id: 'domicilio',
    title: 'Comprobante de domicilio',
    description: 'Recibo de luz, agua o predial con menos de tres meses de antigüedad.',
  },
  {
    id: 'evidencia',
    title: 'Evidencia del negocio',
    description:
      'Fotografía del local, cédula profesional o tarjeta de presentación del salón, barbería o estudio.',
  },
  {
    id: 'minimo',
    title: 'Pedido mínimo de $3,000 MXN',
    description:
      'Aplica a cada pedido, incluidos los resurtidos. Puedes combinar marcas y categorías para alcanzarlo.',
  },
];

const stepIcons: Record<string, LucideIcon> = {
  ClipboardList,
  ShieldCheck,
  FileText,
  Truck,
};

const giros = ['Salón', 'Barbería', 'Estudio de uñas', 'Spa', 'Tienda', 'Otro'];

interface WholesaleValues {
  nombre: string;
  correo: string;
  negocio: string;
  rfc: string;
  telefono: string;
  ciudad: string;
  giro: string;
  marcas: string;
}

type WholesaleField = keyof WholesaleValues | 'aviso';
type WholesaleErrors = Partial<Record<WholesaleField, string>>;

const emptyValues: WholesaleValues = {
  nombre: '',
  correo: '',
  negocio: '',
  rfc: '',
  telefono: '',
  ciudad: '',
  giro: '',
  marcas: '',
};

/** Same order as the DOM, so the first error is also the first field the user reaches. */
const fieldOrder: WholesaleField[] = [
  'nombre',
  'correo',
  'negocio',
  'rfc',
  'telefono',
  'ciudad',
  'giro',
  'aviso',
];

const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const digitsOf = (value: string) => value.replace(/\D/g, '');

function validate(values: WholesaleValues, accepted: boolean): WholesaleErrors {
  const errors: WholesaleErrors = {};

  if (values.nombre.trim().length < 3) errors.nombre = 'Escribe tu nombre completo.';
  if (!emailPattern.test(values.correo.trim()))
    errors.correo = 'Revisa el correo: parece que falta el dominio.';
  if (values.negocio.trim().length < 2) errors.negocio = 'Indica el nombre comercial del negocio.';

  const rfc = values.rfc.trim();
  if (rfc.length < 12 || rfc.length > 13)
    errors.rfc = 'El RFC tiene 13 caracteres (persona física) o 12 (persona moral).';

  if (digitsOf(values.telefono).length !== 10)
    errors.telefono = 'Necesitamos 10 dígitos, con clave lada.';
  if (values.ciudad.trim().length < 3) errors.ciudad = 'Dinos en qué ciudad operas.';
  if (!values.giro) errors.giro = 'Selecciona el giro de tu negocio.';
  if (!accepted) errors.aviso = 'Necesitamos tu consentimiento para dar de alta la cuenta.';

  return errors;
}

export function ClientsPage() {
  const [values, setValues] = useState<WholesaleValues>(emptyValues);
  const [accepted, setAccepted] = useState(false);
  const [errors, setErrors] = useState<WholesaleErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Programa mayorista — Buda Belleza';
  }, []);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const clearError = (field: WholesaleField) => {
    setErrors((prev) => {
      if (!prev[field]) return prev;
      const next = { ...prev };
      delete next[field];
      return next;
    });
  };

  const handleChange = (event: FieldChangeEvent) => {
    const { name, value } = event.target;
    setValues((prev) => ({ ...prev, [name]: value }));
    clearError(name as WholesaleField);
  };

  // No backend in this build: the request lives in local state and never leaves the browser.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values, accepted);
    setErrors(nextErrors);

    const firstInvalid = fieldOrder.find((field) => nextErrors[field]);
    if (firstInvalid) {
      formRef.current?.querySelector<HTMLElement>(`[name="${firstInvalid}"]`)?.focus();
      return;
    }

    setSubmitted(true);
  };

  return (
    <>
      <Section tone="ink" padding="lg" className="grain" aria-labelledby="mayoristas-title">
        <div className="relative z-10 grid items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <Reveal className="flex flex-col gap-5">
              <Eyebrow tone="onDark">Programa mayorista</Eyebrow>
              <h1
                id="mayoristas-title"
                className="font-display text-display-2xl font-medium text-white"
              >
                Compra como distribuidor, no como consumidor
              </h1>
              <p className="text-lead text-ink-300 max-w-xl">
                Abre tu cuenta mayorista y trabaja con lista de precios propia, crédito a 30 días y
                un asesor que conoce tu inventario. Sin cuota de membresía y sin compra mínima
                mensual.
              </p>
            </Reveal>

            <Reveal delay={120} className="mt-9 flex flex-wrap items-center gap-3">
              <ButtonAnchor href="#registro" variant="gold" size="lg">
                Crear mi cuenta
                <ArrowRight
                  aria-hidden="true"
                  className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
                />
              </ButtonAnchor>
              <ButtonAnchor href="#registro" variant="outlineOnDark" size="lg">
                Descargar catálogo PDF
                <Download aria-hidden="true" className="h-4 w-4" />
              </ButtonAnchor>
            </Reveal>

            <Reveal delay={180}>
              <p className="text-ink-300 mt-5 max-w-md text-xs leading-relaxed">
                El catálogo con precios de distribuidor se libera en cuanto validamos tu alta, en
                menos de 24 horas hábiles.
              </p>
            </Reveal>
          </div>

          <Reveal delay={160} y={24} className="lg:col-span-5">
            <div className="rounded-panel border border-white/12 bg-white/[0.06] p-7 shadow-[var(--shadow-e3)] backdrop-blur-md sm:p-8">
              <p className="eyebrow text-gold-300">Lo que incluye tu cuenta</p>
              <ul className="mt-6 flex flex-col gap-5">
                {heroBenefits.map((benefit) => (
                  <li key={benefit} className="flex gap-3.5">
                    <span
                      aria-hidden="true"
                      className="bg-gold-400/15 text-gold-300 mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full ring-1 ring-white/15"
                    >
                      <Check className="h-3.5 w-3.5" />
                    </span>
                    <span className="text-ink-200 text-sm leading-relaxed">{benefit}</span>
                  </li>
                ))}
              </ul>
              <p className="text-ink-300 mt-7 border-t border-white/10 pt-6 text-xs leading-relaxed">
                Más de 3,200 negocios ya resurten con nosotros en 31 estados de la República.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="canvas" padding="lg" aria-labelledby="beneficios-title">
        <SectionHeading
          id="beneficios-title"
          eyebrow="Beneficios"
          title="Seis razones por las que un salón cambia de proveedor"
          description="El precio abre la conversación, pero lo que sostiene la relación es que el producto llegue completo, a tiempo y con quien responda del otro lado."
        />

        <ul className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {benefits.map((benefit, index) => (
            <Reveal as="li" key={benefit.id} delay={index * 60} className="h-full">
              <article className="bg-surface rounded-panel ring-ink-900/[0.05] flex h-full flex-col p-7 shadow-[var(--shadow-e1)] ring-1 transition-[transform,translate,scale,rotate,box-shadow] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]">
                <span
                  aria-hidden="true"
                  className="bg-brand-50 text-brand-600 rounded-card grid h-12 w-12 place-items-center"
                >
                  <benefit.icon className="h-5 w-5" />
                </span>
                <h3 className="text-ink-900 mt-6 text-base font-semibold">{benefit.title}</h3>
                <p className="text-ink-600 mt-2.5 text-sm leading-relaxed">{benefit.description}</p>
              </article>
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="surface" padding="lg" aria-labelledby="volumen-title">
        <SectionHeading
          id="volumen-title"
          eyebrow="Descuentos por volumen"
          title="Mientras más profundo el pedido, más baja la lista"
          description="El descuento se calcula por SKU sobre el precio de lista vigente y se aplica solo en tu cotización, sin trámite ni negociación."
        />

        <Reveal delay={80} className="mt-11">
          <div
            role="group"
            tabIndex={0}
            aria-label="Tabla de descuentos por volumen"
            className="overflow-x-auto"
          >
            <table className="w-full min-w-[46rem] border-separate border-spacing-0 text-left">
              <caption className="sr-only">
                Descuento sobre precio de lista, condiciones de crédito y tipo de entrega según el
                volumen comprado por SKU.
              </caption>
              <thead>
                <tr>
                  {['Volumen por SKU', 'Descuento sobre lista', 'Crédito', 'Entrega'].map(
                    (heading) => (
                      <th
                        key={heading}
                        scope="col"
                        className="eyebrow text-ink-500 border-line border-b px-5 py-4 whitespace-nowrap"
                      >
                        {heading}
                      </th>
                    ),
                  )}
                </tr>
              </thead>
              <tbody>
                {tiers.map((tier) => {
                  const cell = cn(
                    'border-line border-b px-5 py-5 align-middle',
                    tier.popular && 'bg-brand-50 first:rounded-l-2xl last:rounded-r-2xl',
                  );

                  return (
                    <tr key={tier.id}>
                      <th scope="row" className={cn(cell, 'text-left font-normal')}>
                        <span className="text-ink-900 text-sm font-semibold tabular-nums">
                          {tier.volume}
                        </span>
                        {tier.popular && (
                          <Badge tone="gold" className="ml-3 align-middle">
                            Más popular
                          </Badge>
                        )}
                      </th>
                      <td className={cell}>
                        <span
                          className={cn(
                            'font-display text-display-sm leading-none tabular-nums',
                            tier.popular ? 'text-brand-700' : 'text-ink-900',
                          )}
                        >
                          {tier.discount}
                        </span>
                      </td>
                      <td className={cn(cell, 'text-ink-600 text-sm')}>{tier.credit}</td>
                      <td className={cn(cell, 'text-ink-600 text-sm')}>{tier.delivery}</td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>

          <p className="text-ink-500 mt-4 text-xs sm:hidden">
            Desliza la tabla para ver las cuatro columnas.
          </p>
          <p className="text-ink-500 mt-6 max-w-2xl text-xs leading-relaxed">
            Los descuentos son acumulables con las promociones vigentes de temporada y aplican sobre
            existencia. La caja completa se calcula con las piezas por caja de cada SKU.
          </p>
        </Reveal>
      </Section>

      <Section tone="canvas" padding="lg" aria-labelledby="proceso-title">
        <SectionHeading
          id="proceso-title"
          eyebrow="Cómo funciona"
          title="De la solicitud al primer pedido, en cuatro pasos"
          description="Sin intermediarios y sin visitas de vendedor: todo el alta se resuelve en línea o por WhatsApp."
        />

        <ol className="mt-14 grid gap-0 lg:grid-cols-4 lg:gap-6">
          {processSteps.map((step, index) => {
            const Icon = stepIcons[step.icon] ?? ClipboardList;
            const isLast = index === processSteps.length - 1;

            return (
              <Reveal
                as="li"
                key={step.id}
                delay={index * 90}
                className="relative flex gap-5 lg:flex-col lg:gap-0"
              >
                <div className="relative flex w-14 shrink-0 flex-col items-center lg:h-14 lg:w-full lg:flex-row lg:items-center">
                  {!isLast && (
                    <span
                      aria-hidden="true"
                      className="bg-line-strong absolute top-14 bottom-0 left-1/2 w-px -translate-x-1/2 lg:top-1/2 lg:-right-6 lg:bottom-auto lg:left-14 lg:h-px lg:w-auto lg:translate-x-0"
                    />
                  )}
                  <span className="bg-surface ring-line font-display text-ink-900 relative z-10 grid h-14 w-14 shrink-0 place-items-center rounded-full text-lg tabular-nums shadow-[var(--shadow-e1)] ring-1">
                    {step.step}
                  </span>
                </div>

                <div className={cn(isLast ? 'pb-0' : 'pb-10', 'lg:pt-7 lg:pr-6 lg:pb-0')}>
                  <Icon aria-hidden="true" className="text-brand-600 mb-3 h-5 w-5" />
                  <h3 className="text-ink-900 text-base font-semibold">{step.title}</h3>
                  <p className="text-ink-600 mt-2 text-sm leading-relaxed">{step.description}</p>
                </div>
              </Reveal>
            );
          })}
        </ol>
      </Section>

      <Section tone="sunken" padding="lg" aria-labelledby="requisitos-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <SectionHeading
              id="requisitos-title"
              eyebrow="Requisitos"
              title="Tres documentos y un primer pedido"
              description="Pedimos lo indispensable para facturarte bien y confirmar que el producto profesional llega a manos profesionales."
            />

            <ul className="mt-10 grid gap-x-10 gap-y-7 sm:grid-cols-2">
              {requirements.map((requirement, index) => (
                <Reveal as="li" key={requirement.id} delay={index * 70} className="flex gap-3.5">
                  <span
                    aria-hidden="true"
                    className="bg-brand-600 mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full text-white"
                  >
                    <Check className="h-3 w-3" />
                  </span>
                  <div>
                    <h3 className="text-ink-900 text-sm font-semibold">{requirement.title}</h3>
                    <p className="text-ink-600 mt-1.5 text-sm leading-relaxed">
                      {requirement.description}
                    </p>
                  </div>
                </Reveal>
              ))}
            </ul>
          </div>

          <Reveal delay={140} y={24} className="lg:col-span-5">
            <div className="bg-surface rounded-panel ring-ink-900/[0.05] h-full p-7 shadow-[var(--shadow-e2)] ring-1 sm:p-8">
              <span
                aria-hidden="true"
                className="bg-gold-100 text-gold-700 rounded-card grid h-12 w-12 place-items-center"
              >
                <ShieldCheck className="h-5 w-5" />
              </span>
              <h3 className="font-display text-display-sm text-ink-900 mt-6 font-medium">
                ¿Todavía estás por darte de alta ante el SAT?
              </h3>
              <p className="text-ink-600 mt-3 text-sm leading-relaxed">
                Puedes empezar como cuenta en validación: compras a precio mayorista hasta $10,000
                MXN al mes mientras completas tu RFC. Tu asesor te acompaña en el trámite y la
                cuenta se convierte en definitiva sin volver a hacer papeleo.
              </p>
              <ButtonAnchor
                href={buildWhatsappHref(whatsappMessages.validationAccount)}
                target="_blank"
                rel="noreferrer noopener"
                variant="outline"
                size="md"
                className="mt-7"
              >
                Preguntar por WhatsApp
                <MessageCircle aria-hidden="true" className="h-4 w-4" />
              </ButtonAnchor>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="canvas" padding="lg" aria-labelledby="faq-title">
        <SectionHeading
          id="faq-title"
          eyebrow="Preguntas frecuentes"
          title="Lo que preguntan antes de abrir la cuenta"
          description="Y si falta la tuya, tu asesor la responde el mismo día."
        />

        <Reveal delay={80} className="mt-12">
          <Accordion
            items={faqs.map((faq) => ({
              id: faq.id,
              question: faq.question,
              answer: <p>{faq.answer}</p>,
            }))}
          />
        </Reveal>

        <Reveal delay={140} className="mt-8 flex flex-wrap items-center gap-x-4 gap-y-3">
          <p className="text-ink-600 text-sm">¿Tu duda no aparece aquí?</p>
          <ButtonLink to="/contacto" variant="ghost" size="sm">
            Escríbenos
            <ArrowRight
              aria-hidden="true"
              className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
            />
          </ButtonLink>
        </Reveal>
      </Section>

      <Section tone="blush" padding="lg" id="registro" aria-labelledby="registro-title">
        <div className="grid gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="flex flex-col gap-5">
              <Eyebrow>Alta de cliente</Eyebrow>
              <h2
                id="registro-title"
                className="font-display text-display-lg text-ink-900 font-medium"
              >
                Crea tu cuenta mayorista
              </h2>
              <p className="text-lead text-ink-600">
                Llena la solicitud y un asesor la revisa el mismo día hábil. Si la documentación
                está completa, tu cuenta queda activa en menos de 24 horas con la lista de precios
                completa.
              </p>
            </Reveal>

            <Reveal delay={100} className="mt-9">
              <ul className="flex flex-col gap-3.5">
                {certifications.map((certification) => (
                  <li key={certification} className="text-ink-700 flex items-center gap-3 text-sm">
                    <ShieldCheck aria-hidden="true" className="text-brand-600 h-4 w-4 shrink-0" />
                    {certification}
                  </li>
                ))}
              </ul>
            </Reveal>

            <Reveal delay={160} className="mt-9">
              <div className="bg-surface/70 rounded-card ring-ink-900/[0.05] p-5 ring-1">
                <p className="text-ink-900 text-sm font-semibold">
                  ¿Prefieres darte de alta por WhatsApp?
                </p>
                <p className="text-ink-600 mt-1.5 text-sm leading-relaxed">
                  Mándanos tu RFC y una foto del local al {whatsappHandle} y nosotros capturamos la
                  solicitud por ti.
                </p>
              </div>
            </Reveal>
          </div>

          <Reveal delay={120} y={24} className="lg:col-span-7">
            {submitted ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="bg-surface rounded-panel-lg p-8 text-center shadow-[var(--shadow-e2)] sm:p-12"
              >
                <span
                  aria-hidden="true"
                  className="bg-success-100 text-success-700 mx-auto grid h-16 w-16 place-items-center rounded-full"
                >
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h3 className="font-display text-display-sm text-ink-900 mt-6 font-medium">
                  Recibimos tu solicitud
                </h3>
                <p className="text-ink-600 mx-auto mt-3 max-w-md text-sm leading-relaxed">
                  {values.nombre.trim().split(' ')[0]}, tu solicitud para{' '}
                  <span className="text-ink-900 font-semibold">{values.negocio.trim()}</span> ya
                  está en la fila de validación. Te escribimos al correo que registraste.
                </p>

                <ol className="text-ink-600 mx-auto mt-8 flex max-w-sm flex-col gap-3 text-left text-sm">
                  {[
                    'Revisamos tu RFC y la evidencia del negocio en menos de 24 horas hábiles.',
                    'Te asignamos asesor y te mandamos la lista de precios mayorista.',
                    'Armas tu primer pedido desde $3,000 MXN y programamos la entrega.',
                  ].map((line, index) => (
                    <li key={line} className="flex gap-3">
                      <span
                        aria-hidden="true"
                        className="bg-ink-100 text-ink-700 font-display mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full text-xs tabular-nums"
                      >
                        {index + 1}
                      </span>
                      <span className="leading-relaxed">{line}</span>
                    </li>
                  ))}
                </ol>

                <ButtonAnchor
                  href={buildWhatsappHref(whatsappMessages.signup)}
                  target="_blank"
                  rel="noreferrer noopener"
                  variant="gold"
                  size="lg"
                  className="mt-9"
                >
                  Adelantar mi alta por WhatsApp
                  <MessageCircle aria-hidden="true" className="h-4 w-4" />
                </ButtonAnchor>
              </div>
            ) : (
              <form
                ref={formRef}
                noValidate
                onSubmit={handleSubmit}
                aria-labelledby="registro-title"
                className="bg-surface rounded-panel-lg p-6 shadow-[var(--shadow-e2)] sm:p-8"
              >
                <p className="text-ink-500 text-xs">
                  Los campos marcados con <span className="text-brand-600">*</span> son
                  obligatorios.
                </p>

                <div className="mt-6 grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="reg-nombre"
                    name="nombre"
                    label="Nombre completo"
                    autoComplete="name"
                    required
                    value={values.nombre}
                    onChange={handleChange}
                    error={errors.nombre}
                    placeholder="Mariana Olvera"
                  />
                  <FormField
                    id="reg-correo"
                    name="correo"
                    label="Correo electrónico"
                    type="email"
                    inputMode="email"
                    autoComplete="email"
                    required
                    value={values.correo}
                    onChange={handleChange}
                    error={errors.correo}
                    placeholder="compras@tunegocio.mx"
                  />
                  <FormField
                    id="reg-negocio"
                    name="negocio"
                    label="Nombre del negocio"
                    autoComplete="organization"
                    required
                    value={values.negocio}
                    onChange={handleChange}
                    error={errors.negocio}
                    placeholder="Estudio Olvera"
                  />
                  <FormField
                    id="reg-rfc"
                    name="rfc"
                    label="RFC"
                    autoComplete="off"
                    required
                    value={values.rfc}
                    onChange={handleChange}
                    error={errors.rfc}
                    hint="13 caracteres para persona física, 12 para persona moral."
                    placeholder="OLMA850312HT9"
                  />
                  <FormField
                    id="reg-telefono"
                    name="telefono"
                    label="Teléfono o WhatsApp"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={values.telefono}
                    onChange={handleChange}
                    error={errors.telefono}
                    hint="10 dígitos con clave lada."
                    placeholder="55 4321 8800"
                  />
                  <FormField
                    id="reg-ciudad"
                    name="ciudad"
                    label="Ciudad"
                    autoComplete="address-level2"
                    required
                    value={values.ciudad}
                    onChange={handleChange}
                    error={errors.ciudad}
                    placeholder="Guadalajara"
                  />
                  <FormField
                    id="reg-giro"
                    name="giro"
                    label="Giro del negocio"
                    required
                    value={values.giro}
                    onChange={handleChange}
                    error={errors.giro}
                    className="sm:col-span-2"
                  >
                    <select className="h-12 appearance-none pr-11">
                      <option value="">Selecciona una opción</option>
                      {giros.map((giro) => (
                        <option key={giro} value={giro}>
                          {giro}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField
                    id="reg-marcas"
                    name="marcas"
                    label="¿Qué marcas trabajas hoy?"
                    value={values.marcas}
                    onChange={handleChange}
                    hint="Nos ayuda a preparar equivalencias y a cotizarte mejor desde el primer pedido."
                    className="sm:col-span-2"
                  >
                    <textarea
                      rows={4}
                      placeholder="Coloración, decolorante, línea de cabina, herramienta…"
                      className="resize-y py-3"
                    />
                  </FormField>

                  <div className="sm:col-span-2">
                    <label
                      htmlFor="reg-aviso"
                      className="text-ink-600 flex cursor-pointer items-start gap-3 py-1 text-sm leading-relaxed"
                    >
                      <input
                        id="reg-aviso"
                        name="aviso"
                        type="checkbox"
                        required
                        checked={accepted}
                        onChange={(event) => {
                          setAccepted(event.target.checked);
                          clearError('aviso');
                        }}
                        aria-invalid={errors.aviso ? true : undefined}
                        aria-describedby={errors.aviso ? 'reg-aviso-error' : undefined}
                        className="accent-brand-600 mt-0.5 h-5 w-5 shrink-0 cursor-pointer rounded-md"
                      />
                      <span>
                        Acepto el{' '}
                        <span className="text-ink-800 font-semibold">aviso de privacidad</span> y
                        que Buda Belleza use mis datos para validar el alta y darme seguimiento
                        comercial.
                      </span>
                    </label>
                    {errors.aviso && (
                      <p
                        id="reg-aviso-error"
                        role="alert"
                        className="text-danger-700 mt-2 text-xs font-medium"
                      >
                        {errors.aviso}
                      </p>
                    )}
                  </div>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Enviar solicitud
                    <ArrowRight
                      aria-hidden="true"
                      className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
                    />
                  </Button>
                  <p className="text-ink-500 text-xs leading-relaxed sm:max-w-[16rem] sm:text-right">
                    Respondemos en menos de 24 horas hábiles. No compartimos tus datos con terceros.
                  </p>
                </div>
              </form>
            )}
          </Reveal>
        </div>
      </Section>
    </>
  );
}
