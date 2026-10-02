import { Clock, Mail, MapPin, Phone } from 'lucide-react';
import { Link } from 'react-router-dom';
import { socialIconMap } from '../icons/socialIconMap';
import { WhatsAppIcon } from '../icons/SocialIcons';
import { branches, certifications, paymentMethods } from '../../data/institutional';
import { buildWhatsappHref, socialLinkHref, whatsappMessages } from '../../lib/whatsapp';
import { ButtonAnchor, ButtonLink } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { Logotype } from './Logotype';
import type { Category } from '../../types/category';
import type { SocialLink } from '../../types/social';

interface FooterProps {
  categories: Category[];
  socialLinks: SocialLink[];
}

const companyLinks = [
  { label: 'Programa mayorista', to: '/mayoristas' },
  { label: 'Marcas', to: '/marcas' },
  { label: 'Sucursales', to: '/contacto' },
  { label: 'Aviso de privacidad', to: '/aviso-de-privacidad' },
  { label: 'Términos de venta', to: '/terminos-de-venta' },
  { label: 'Política de envíos', to: '/politica-de-envios' },
];

const linkClass = 'text-ink-300 hover:text-white text-sm transition-colors duration-200';

export function Footer({ categories, socialLinks }: FooterProps) {
  const whatsapp = socialLinks.find((link) => link.id === 'whatsapp');

  return (
    <footer className="grain bg-ink-950 mt-8 overflow-hidden rounded-t-[2.5rem]">
      <div className="shell py-14 sm:py-18">
        <div className="grid gap-8 lg:grid-cols-[1.15fr_0.85fr] lg:items-end lg:gap-16">
          <div className="flex flex-col gap-4">
            <Eyebrow tone="onDark">Distribución mayorista</Eyebrow>
            <h2 className="font-display text-display-md font-medium text-white">
              Compra al mayoreo con respaldo técnico
            </h2>
            <p className="text-ink-300 max-w-xl text-sm leading-relaxed sm:text-base">
              Damos de alta tu negocio en menos de 24 horas hábiles, te asignamos un asesor y
              surtimos desde dos centros de distribución propios. Sin mínimos por marca, con factura
              CFDI 4.0 y crédito a 30 días para clientes recurrentes.
            </p>
          </div>

          <div className="rounded-panel border border-white/10 bg-white/[0.04] p-6 sm:p-7">
            <p className="eyebrow text-gold-300">Tu asesor asignado</p>
            <p className="text-ink-200 mt-3 text-sm leading-relaxed">
              Cotizamos tu lista completa por WhatsApp y te avisamos antes de que se te acabe el
              producto de mayor rotación.
            </p>
            <div className="mt-6 flex flex-col gap-2.5 sm:flex-row">
              <ButtonLink to="/mayoristas" variant="primary" size="md" className="sm:flex-1">
                Solicitar alta mayorista
              </ButtonLink>
              {whatsapp && (
                <ButtonAnchor
                  href={buildWhatsappHref(whatsappMessages.advisor)}
                  target="_blank"
                  rel="noreferrer"
                  variant="outlineOnDark"
                  size="md"
                  className="sm:flex-1"
                >
                  <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
                  WhatsApp
                </ButtonAnchor>
              )}
            </div>
          </div>
        </div>

        <div className="rule-fade my-12 opacity-30 sm:my-14" />

        <div className="grid gap-10 sm:grid-cols-2 lg:grid-cols-12 lg:gap-8">
          <div className="flex flex-col gap-5 lg:col-span-4">
            <Logotype variant="light" />
            <p className="text-ink-300 max-w-sm text-sm leading-relaxed">
              Distribuidora mexicana de productos profesionales de belleza desde 2007. Abastecemos a
              más de 3,200 salones, barberías y estudios de uñas en los 31 estados del país con
              inventario propio y marcas con respaldo de fábrica.
            </p>
            <ul className="flex flex-wrap gap-2">
              {certifications.map((certification) => (
                <li
                  key={certification}
                  className="text-ink-200 rounded-full border border-white/15 bg-white/5 px-2.5 py-1 text-[0.6875rem] font-medium"
                >
                  {certification}
                </li>
              ))}
            </ul>
          </div>

          <nav aria-labelledby="footer-categorias" className="lg:col-span-2">
            <h3 id="footer-categorias" className="eyebrow text-gold-300 mb-4">
              Categorías
            </h3>
            <ul className="flex flex-col gap-2.5">
              {categories.map((category) => (
                <li key={category.slug}>
                  <Link to={`/categoria/${category.slug}`} className={linkClass}>
                    {category.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <nav aria-labelledby="footer-empresa" className="lg:col-span-3">
            <h3 id="footer-empresa" className="eyebrow text-gold-300 mb-4">
              Empresa
            </h3>
            <ul className="flex flex-col gap-2.5">
              {companyLinks.map((link) => (
                <li key={link.label}>
                  <Link to={link.to} className={linkClass}>
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>

          <div className="lg:col-span-3">
            <h3 className="eyebrow text-gold-300 mb-4">Atención a clientes</h3>
            <ul className="flex flex-col gap-3 text-sm">
              <li>
                <a
                  href="tel:+525543218800"
                  className="text-ink-200 flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Phone className="text-gold-400 h-4 w-4 shrink-0" aria-hidden="true" />
                  <span className="tabular-nums">+52 55 4321 8800</span>
                </a>
              </li>
              <li>
                <a
                  href="mailto:ventas@budabelleza.mx"
                  className="text-ink-200 flex items-center gap-2.5 transition-colors hover:text-white"
                >
                  <Mail className="text-gold-400 h-4 w-4 shrink-0" aria-hidden="true" />
                  ventas@budabelleza.mx
                </a>
              </li>
              <li className="text-ink-300 flex items-start gap-2.5">
                <Clock className="text-gold-400 mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Lun a Vie 9:00–19:00 · Sáb 9:00–15:00</span>
              </li>
              <li className="text-ink-300 flex items-start gap-2.5">
                <MapPin className="text-gold-400 mt-0.5 h-4 w-4 shrink-0" aria-hidden="true" />
                <span>Sucursales en {branches.map((branch) => branch.city).join(', ')}</span>
              </li>
            </ul>
          </div>
        </div>

        <ul className="mt-12 flex flex-wrap gap-2.5">
          {socialLinks.map((link) => {
            const Icon = socialIconMap[link.id];
            return (
              <li key={link.id}>
                <a
                  href={socialLinkHref(link)}
                  target="_blank"
                  rel="noreferrer"
                  className="group text-ink-200 flex items-center gap-2.5 rounded-full border border-white/12 py-1.5 pr-4 pl-1.5 text-sm transition-colors duration-200 hover:border-white/40 hover:text-white"
                >
                  <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full border border-white/15 transition-colors duration-200 group-hover:border-white/40">
                    <Icon className="h-4 w-4" aria-hidden="true" />
                  </span>
                  <span className="sr-only">{link.label}: </span>
                  <span>{link.handle}</span>
                </a>
              </li>
            );
          })}
        </ul>
      </div>

      <div className="border-t border-white/10">
        <div className="shell flex flex-col gap-5 py-6 lg:flex-row lg:items-center lg:justify-between">
          <ul className="flex flex-wrap gap-2">
            {paymentMethods.map((method) => (
              <li
                key={method}
                className="text-ink-300 rounded-full border border-white/12 px-2.5 py-1 text-[0.6875rem] font-medium"
              >
                {method}
              </li>
            ))}
          </ul>
          <p className="text-ink-300 text-xs">
            © {new Date().getFullYear()} Buda Belleza S.A. de C.V. · Todos los derechos reservados ·
            Hecho en México
          </p>
        </div>
      </div>
    </footer>
  );
}
