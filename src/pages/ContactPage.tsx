import {
  ArrowRight,
  CheckCircle2,
  Clock,
  Mail,
  MapPin,
  Navigation,
  Phone,
  Send,
} from 'lucide-react';
import { useEffect, useRef, useState, type ComponentType, type FormEvent } from 'react';
import { FormField, type FieldChangeEvent } from '../components/forms/FormField';
import { socialIconMap } from '../components/icons/socialIconMap';
import { Badge } from '../components/ui/Badge';
import { Button, ButtonAnchor, ButtonLink } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { branches } from '../data/institutional';
import { socialLinks } from '../data/social-links';
import { cn } from '../lib/cn';
import { buildWhatsappHref, whatsappMessages } from '../lib/whatsapp';

const whatsapp = socialLinks.find((link) => link.id === 'whatsapp');
const whatsappHref = buildWhatsappHref(whatsappMessages.contact);
const whatsappHandle = whatsapp?.handle ?? '+52 55 4321 8800';

const motivos = ['Cotización', 'Alta mayorista', 'Facturación', 'Garantías', 'Otro'];

interface ContactCard {
  id: string;
  icon: ComponentType<{ className?: string }>;
  label: string;
  value: string;
  detail: string;
  href?: string;
  external?: boolean;
  featured?: boolean;
}

const contactCards: ContactCard[] = [
  {
    id: 'whatsapp',
    icon: socialIconMap.whatsapp,
    label: 'WhatsApp mayoreo',
    value: whatsappHandle,
    detail: 'La vía más rápida: cotizamos y levantamos pedido en el mismo chat.',
    href: whatsappHref,
    external: true,
    featured: true,
  },
  {
    id: 'telefono',
    icon: Phone,
    label: 'Conmutador',
    value: '+52 55 4321 8800',
    detail: 'Ext. 101 ventas · Ext. 205 facturación · Ext. 310 garantías.',
    href: 'tel:+525543218800',
  },
  {
    id: 'correo',
    icon: Mail,
    label: 'Correo',
    value: 'mayoreo@budabelleza.mx',
    detail: 'Órdenes de compra, contrarrecibos y propuestas de distribución.',
    href: 'mailto:mayoreo@budabelleza.mx',
  },
  {
    id: 'horario',
    icon: Clock,
    label: 'Horario de atención',
    value: 'Lun a Vie · 9:00 a 19:00',
    detail: 'Sábado de 9:00 a 15:00. Los pedidos en línea se reciben todo el día.',
  },
];

interface ContactValues {
  nombre: string;
  negocio: string;
  correo: string;
  telefono: string;
  motivo: string;
  mensaje: string;
}

type ContactField = keyof ContactValues;
type ContactErrors = Partial<Record<ContactField, string>>;

const emptyValues: ContactValues = {
  nombre: '',
  negocio: '',
  correo: '',
  telefono: '',
  motivo: '',
  mensaje: '',
};

/** Same order as the DOM, so the first error is also the first field the user reaches. */
const fieldOrder: ContactField[] = ['nombre', 'negocio', 'correo', 'telefono', 'motivo', 'mensaje'];

const emailPattern = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i;
const digitsOf = (value: string) => value.replace(/\D/g, '');

function validate(values: ContactValues): ContactErrors {
  const errors: ContactErrors = {};

  if (values.nombre.trim().length < 3) errors.nombre = 'Escribe tu nombre completo.';
  if (!emailPattern.test(values.correo.trim()))
    errors.correo = 'Revisa el correo: parece que falta el dominio.';
  if (digitsOf(values.telefono).length !== 10)
    errors.telefono = 'Necesitamos 10 dígitos, con clave lada.';
  if (!values.motivo) errors.motivo = 'Selecciona el motivo de tu mensaje.';
  if (values.mensaje.trim().length < 15)
    errors.mensaje = 'Cuéntanos un poco más para canalizar tu mensaje.';

  return errors;
}

export function ContactPage() {
  const [values, setValues] = useState<ContactValues>(emptyValues);
  const [errors, setErrors] = useState<ContactErrors>({});
  const [submitted, setSubmitted] = useState(false);
  const formRef = useRef<HTMLFormElement>(null);
  const successRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    document.title = 'Contacto — Buda Belleza';
  }, []);

  useEffect(() => {
    if (submitted) successRef.current?.focus();
  }, [submitted]);

  const handleChange = (event: FieldChangeEvent) => {
    const { name, value } = event.target;
    setValues((previous) => ({ ...previous, [name]: value }));
    setErrors((previous) => {
      const field = name as ContactField;
      if (!previous[field]) return previous;
      const next = { ...previous };
      delete next[field];
      return next;
    });
  };

  // No backend in this build: the message lives in local state and never leaves the browser.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const nextErrors = validate(values);
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
      <Section
        tone="canvas"
        padding="lg"
        className="pb-8 sm:pb-10"
        aria-labelledby="contacto-title"
      >
        <Reveal className="flex max-w-3xl flex-col gap-5">
          <Eyebrow>Atención a clientes</Eyebrow>
          <h1 id="contacto-title" className="font-display text-display-xl text-ink-900 font-medium">
            Hablemos de tu negocio
          </h1>
          <p className="text-lead text-ink-600">
            Un equipo comercial de verdad, no un formulario que nadie lee. Escríbenos y te contesta
            una persona que conoce el catálogo, las existencias y las condiciones de crédito.
          </p>
        </Reveal>
      </Section>

      <Section tone="canvas" padding="none" className="pb-16 sm:pb-24">
        <div className="grid min-w-0 gap-10 lg:grid-cols-12 lg:gap-12">
          <Reveal y={16} className="min-w-0 lg:col-span-7">
            {submitted ? (
              <div
                ref={successRef}
                tabIndex={-1}
                role="status"
                aria-live="polite"
                className="bg-surface rounded-panel-lg ring-ink-900/[0.05] p-8 text-center shadow-[var(--shadow-e2)] ring-1 sm:p-12"
              >
                <span
                  aria-hidden="true"
                  className="bg-success-100 text-success-700 mx-auto grid h-16 w-16 place-items-center rounded-full"
                >
                  <CheckCircle2 className="h-8 w-8" />
                </span>
                <h2 className="font-display text-display-sm text-ink-900 mt-6 font-medium">
                  Mensaje enviado
                </h2>
                <p className="text-ink-600 mx-auto mt-3 max-w-md text-sm leading-relaxed">
                  Gracias, {values.nombre.trim().split(' ')[0]}. Turnamos tu mensaje al área de{' '}
                  <span className="text-ink-900 font-semibold">{values.motivo.toLowerCase()}</span>{' '}
                  y te respondemos al correo que registraste dentro del siguiente día hábil.
                </p>
                <p className="text-ink-500 mx-auto mt-6 max-w-sm text-xs leading-relaxed">
                  ¿Es urgente? Escríbenos por WhatsApp y lo resolvemos en el momento.
                </p>
                <ButtonAnchor
                  href={whatsappHref}
                  target="_blank"
                  rel="noreferrer noopener"
                  variant="gold"
                  size="lg"
                  className="mt-6"
                >
                  Abrir WhatsApp
                  <ArrowRight
                    aria-hidden="true"
                    className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
                  />
                </ButtonAnchor>
              </div>
            ) : (
              <form
                ref={formRef}
                noValidate
                onSubmit={handleSubmit}
                aria-labelledby="formulario-title"
                className="bg-surface rounded-panel-lg ring-ink-900/[0.05] p-6 shadow-[var(--shadow-e2)] ring-1 sm:p-8"
              >
                <h2
                  id="formulario-title"
                  className="font-display text-display-sm text-ink-900 font-medium"
                >
                  Escríbenos
                </h2>
                <p className="text-ink-500 mt-2 text-xs">
                  Los campos marcados con <span className="text-brand-600">*</span> son
                  obligatorios.
                </p>

                <div className="mt-7 grid gap-5 sm:grid-cols-2">
                  <FormField
                    id="con-nombre"
                    name="nombre"
                    label="Nombre completo"
                    autoComplete="name"
                    required
                    value={values.nombre}
                    onChange={handleChange}
                    error={errors.nombre}
                    placeholder="Diego Fuentes"
                  />
                  <FormField
                    id="con-negocio"
                    name="negocio"
                    label="Negocio (opcional)"
                    autoComplete="organization"
                    value={values.negocio}
                    onChange={handleChange}
                    placeholder="Fuentes Barber Club"
                  />
                  <FormField
                    id="con-correo"
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
                    id="con-telefono"
                    name="telefono"
                    label="Teléfono"
                    type="tel"
                    inputMode="tel"
                    autoComplete="tel"
                    required
                    value={values.telefono}
                    onChange={handleChange}
                    error={errors.telefono}
                    hint="10 dígitos con clave lada."
                    placeholder="81 2299 6070"
                  />
                  <FormField
                    id="con-motivo"
                    name="motivo"
                    label="Motivo"
                    required
                    value={values.motivo}
                    onChange={handleChange}
                    error={errors.motivo}
                    className="sm:col-span-2"
                  >
                    <select className="h-12 appearance-none pr-11">
                      <option value="">Selecciona una opción</option>
                      {motivos.map((motivo) => (
                        <option key={motivo} value={motivo}>
                          {motivo}
                        </option>
                      ))}
                    </select>
                  </FormField>
                  <FormField
                    id="con-mensaje"
                    name="mensaje"
                    label="Mensaje"
                    required
                    value={values.mensaje}
                    onChange={handleChange}
                    error={errors.mensaje}
                    hint="Si es una cotización, incluye marcas, presentaciones y cantidades aproximadas."
                    className="sm:col-span-2"
                  >
                    <textarea
                      rows={5}
                      placeholder="Necesito cotizar coloración y oxidante para dos sucursales…"
                      className="resize-y py-3"
                    />
                  </FormField>
                </div>

                <div className="mt-8 flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
                  <Button type="submit" size="lg" className="w-full sm:w-auto">
                    Enviar mensaje
                    <Send aria-hidden="true" className="h-4 w-4" />
                  </Button>
                  <p className="text-ink-500 text-xs leading-relaxed sm:max-w-[15rem] sm:text-right">
                    Contestamos dentro del siguiente día hábil.
                  </p>
                </div>
              </form>
            )}
          </Reveal>

          <div className="min-w-0 lg:col-span-5">
            <ul className="flex flex-col gap-4">
              {contactCards.map((card, index) => {
                const Icon = card.icon;
                const body = (
                  <>
                    <span
                      aria-hidden="true"
                      className={cn(
                        'rounded-card grid h-11 w-11 shrink-0 place-items-center transition-colors duration-250 ease-[var(--ease-out-quint)]',
                        card.featured
                          ? 'bg-gold-400 text-ink-900'
                          : 'bg-ink-100 text-ink-700 group-hover:bg-brand-50 group-hover:text-brand-600',
                      )}
                    >
                      <Icon className="h-5 w-5" />
                    </span>
                    <span className="min-w-0">
                      <span className="eyebrow text-ink-500 block">{card.label}</span>
                      <span className="text-ink-900 mt-1.5 block text-base font-semibold wrap-anywhere">
                        {card.value}
                      </span>
                      <span className="text-ink-600 mt-1.5 block text-sm leading-relaxed">
                        {card.detail}
                      </span>
                    </span>
                  </>
                );

                const shell = cn(
                  'flex w-full gap-4 rounded-panel p-6 text-left transition-[transform,translate,scale,rotate,box-shadow] duration-300 ease-[var(--ease-out-quint)]',
                  card.featured
                    ? 'bg-gold-50 ring-2 ring-gold-300 shadow-[var(--shadow-gold)]'
                    : 'bg-surface ring-1 ring-ink-900/[0.05] shadow-[var(--shadow-e1)]',
                  card.href && 'hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]',
                );

                return (
                  <Reveal as="li" key={card.id} delay={index * 70} y={14}>
                    {card.href ? (
                      <a
                        href={card.href}
                        target={card.external ? '_blank' : undefined}
                        rel={card.external ? 'noreferrer noopener' : undefined}
                        className={cn('group', shell)}
                      >
                        {body}
                      </a>
                    ) : (
                      <div className={shell}>{body}</div>
                    )}
                  </Reveal>
                );
              })}
            </ul>

            <Reveal delay={280} className="mt-8">
              <p className="eyebrow text-ink-500">Síguenos</p>
              <ul className="mt-4 flex flex-wrap gap-3">
                {socialLinks.map((link) => {
                  const Icon = socialIconMap[link.id];

                  return (
                    <li key={link.id}>
                      <a
                        href={link.href}
                        target="_blank"
                        rel="noreferrer noopener"
                        aria-label={`${link.label} · ${link.handle}`}
                        className="bg-surface text-ink-700 ring-line hover:bg-ink-900 grid h-12 w-12 place-items-center rounded-full ring-1 transition-colors duration-250 ease-[var(--ease-out-quint)] hover:text-white"
                      >
                        <Icon aria-hidden="true" className="h-5 w-5" />
                      </a>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </Section>

      <Section tone="surface" padding="lg" aria-labelledby="sucursales-title">
        <SectionHeading
          id="sucursales-title"
          eyebrow="Sucursales"
          title="Tres puntos de atención, dos centros de distribución"
          description="Puedes recoger el mismo día en mostrador o pedir que salga por ruta propia. Los dos centros de distribución surten al resto del país."
        />

        <ul className="mt-12 grid gap-5 lg:grid-cols-3">
          {branches.map((branch, index) => {
            const mapsQuery = encodeURIComponent(
              `${branch.address}, ${branch.city}, ${branch.state}`,
            );

            return (
              <Reveal as="li" key={branch.id} delay={index * 80} className="h-full">
                <article className="bg-canvas rounded-panel ring-line flex h-full flex-col p-7 ring-1">
                  <div className="flex flex-wrap items-start justify-between gap-x-3 gap-y-2">
                    <h3 className="font-display text-display-sm text-ink-900 font-medium">
                      {branch.city}
                    </h3>
                    {branch.distributionCenter && (
                      <Badge tone="gold" className="mt-1 shrink-0">
                        Centro de distribución
                      </Badge>
                    )}
                  </div>
                  <p className="eyebrow text-ink-500 mt-2">{branch.state}</p>

                  <ul className="mt-7 flex flex-col gap-4 text-sm">
                    <li className="flex gap-3">
                      <MapPin aria-hidden="true" className="text-ink-400 mt-0.5 h-4 w-4 shrink-0" />
                      <span className="text-ink-600 leading-relaxed">{branch.address}</span>
                    </li>
                    <li className="flex gap-3">
                      <Phone aria-hidden="true" className="text-ink-400 mt-0.5 h-4 w-4 shrink-0" />
                      <a
                        href={`tel:${branch.phone.replace(/\s/g, '')}`}
                        className="text-ink-800 hover:text-brand-600 font-medium tabular-nums transition-colors duration-200"
                      >
                        {branch.phone}
                      </a>
                    </li>
                    <li className="flex gap-3">
                      <Clock aria-hidden="true" className="text-ink-400 mt-0.5 h-4 w-4 shrink-0" />
                      <span className="text-ink-600 leading-relaxed">{branch.hours}</span>
                    </li>
                  </ul>

                  <div className="mt-auto pt-7">
                    <ButtonAnchor
                      href={`https://www.google.com/maps/search/?api=1&query=${mapsQuery}`}
                      target="_blank"
                      rel="noreferrer noopener"
                      variant="outline"
                      size="sm"
                      aria-label={`Cómo llegar a la sucursal ${branch.city}`}
                    >
                      Cómo llegar
                      <Navigation aria-hidden="true" className="h-4 w-4" />
                    </ButtonAnchor>
                  </div>
                </article>
              </Reveal>
            );
          })}
        </ul>
      </Section>

      <Section tone="ink" padding="md" className="grain" aria-labelledby="atajo-title">
        <div className="relative z-10 grid gap-8 lg:grid-cols-2 lg:items-center lg:gap-16">
          <Reveal className="flex flex-col gap-4">
            <Eyebrow tone="onDark">Programa mayorista</Eyebrow>
            <h2 id="atajo-title" className="font-display text-display-md font-medium text-white">
              ¿Tu duda es sobre precios de mayoreo?
            </h2>
            <p className="text-ink-300 text-sm leading-relaxed lg:text-base">
              Los requisitos de alta, la tabla de descuentos por volumen y las preguntas frecuentes
              están completas en la página del programa. Ahí mismo puedes abrir tu cuenta sin
              esperar respuesta.
            </p>
          </Reveal>

          <Reveal delay={110} className="lg:justify-self-end">
            <ButtonLink to="/mayoristas#registro" variant="gold" size="lg">
              Abrir mi cuenta mayorista
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
              />
            </ButtonLink>
          </Reveal>
        </div>
      </Section>
    </>
  );
}
