import { ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronRight } from 'lucide-react';
import { useEffect, useId, useMemo, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { WhatsAppIcon } from '../components/icons/SocialIcons';
import { ProductGrid } from '../components/product/ProductGrid';
import { Badge } from '../components/ui/Badge';
import { ButtonAnchor, ButtonLink } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { SectionHeading } from '../components/ui/SectionHeading';
import { SmartImage } from '../components/ui/SmartImage';
import { QUOTE_MINIMUM_MXN } from '../context/quote-store';
import { categories, getCategoryBySlug } from '../data/categories';
import { getProductsByCategory } from '../data/products';
import { socialLinks } from '../data/social-links';
import { formatInteger, formatPrice, formatReferences } from '../lib/format';
import type { Category } from '../types/category';
import type { Product } from '../types/product';

type SortKey = 'relevancia' | 'mas-vendidos' | 'novedades' | 'nombre';

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'mas-vendidos', label: 'Más vendidos' },
  { value: 'novedades', label: 'Novedades' },
  { value: 'nombre', label: 'Nombre A-Z' },
];

const whatsappBase =
  socialLinks.find((link) => link.id === 'whatsapp')?.href ?? 'https://wa.me/525543218800';

const SERVICE_FACTS = [
  'Pedidos confirmados antes de las 14:00 salen el mismo día desde nuestro centro de distribución.',
  'Ficha técnica y hoja de seguridad de cada clave, listas para tu expediente de cabina.',
  'Reposición programada por consumo para que no canceles servicios por falta de producto.',
];

function relevance(product: Product) {
  let score = 0;
  if (product.tags?.includes('bestseller')) score += 3;
  if (product.tags?.includes('new')) score += 1;
  return score;
}

function sortProducts(list: Product[], sort: SortKey) {
  const next = [...list];
  switch (sort) {
    case 'mas-vendidos':
      return next.sort(
        (a, b) =>
          (a.salesRank ?? Number.MAX_SAFE_INTEGER) - (b.salesRank ?? Number.MAX_SAFE_INTEGER),
      );
    case 'novedades':
      return next.sort((a, b) => (b.firstSeen ?? '').localeCompare(a.firstSeen ?? ''));
    case 'nombre':
      return next.sort((a, b) => a.name.localeCompare(b.name, 'es-MX'));
    default:
      return next.sort((a, b) => relevance(b) - relevance(a));
  }
}

function CategoryLinkCard({ category }: { category: Category }) {
  return (
    <Link
      to={`/categoria/${category.slug}`}
      className="group bg-surface rounded-card ring-ink-900/[0.05] flex h-full items-center gap-3 p-3 shadow-[var(--shadow-e1)] ring-1 transition-[transform,translate,scale,rotate,box-shadow] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[var(--shadow-e3)]"
    >
      <SmartImage
        id={category.imageId}
        alt=""
        width={128}
        height={128}
        sizes="56px"
        wrapperClassName="h-14 w-14 shrink-0 rounded-[0.875rem]"
      />
      <span className="min-w-0 flex-1">
        <span className="text-ink-900 group-hover:text-brand-700 block truncate text-sm font-semibold transition-colors duration-250 ease-[var(--ease-out-quint)]">
          {category.name}
        </span>
        <span className="text-ink-400 block text-xs tabular-nums">
          {formatReferences(category.productCount)}
        </span>
      </span>
      <ArrowUpRight
        aria-hidden="true"
        className="text-ink-300 group-hover:text-brand-600 h-4 w-4 shrink-0 transition-[color,transform,translate,scale,rotate] duration-300 ease-[var(--ease-out-quint)] group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
      />
    </Link>
  );
}

function CategoryNotFound() {
  return (
    <Section tone="canvas" padding="lg" aria-labelledby="categoria-404-title">
      <div className="mx-auto flex max-w-3xl flex-col items-center gap-5 text-center">
        <Eyebrow tone="muted">Categoría no encontrada</Eyebrow>
        <h1
          id="categoria-404-title"
          className="font-display text-display-xl text-ink-900 font-medium"
        >
          Esa especialidad no está en el catálogo
        </h1>
        <p className="text-lead text-ink-600 max-w-xl">
          Es probable que el enlace esté incompleto o que hayamos reorganizado la línea. Estas son
          las especialidades que tenemos publicadas en el catálogo.
        </p>
      </div>

      <ul className="mt-12 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {categories.map((category, index) => (
          <Reveal as="li" key={category.slug} delay={Math.min(index, 5) * 60} y={14}>
            <CategoryLinkCard category={category} />
          </Reveal>
        ))}
      </ul>

      <div className="mt-10 flex justify-center">
        <ButtonLink to="/catalogo" variant="outline" size="lg">
          Ver el catálogo completo
          <ArrowRight
            aria-hidden="true"
            className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
          />
        </ButtonLink>
      </div>
    </Section>
  );
}

export function CategoryPage() {
  const { slug } = useParams<{ slug: string }>();
  const category = slug ? getCategoryBySlug(slug) : undefined;

  const sortId = useId();
  const [sort, setSort] = useState<SortKey>('relevancia');

  const categoryProducts = useMemo(
    () => (category ? getProductsByCategory(category.slug) : []),
    [category],
  );
  const sorted = useMemo(() => sortProducts(categoryProducts, sort), [categoryProducts, sort]);

  useEffect(() => {
    document.title = category
      ? `${category.name} — Buda Belleza`
      : 'Categoría no encontrada — Buda Belleza';
  }, [category]);

  if (!category) return <CategoryNotFound />;

  const others = categories.filter((entry) => entry.slug !== category.slug);
  const whatsappHref = `${whatsappBase}?text=${encodeURIComponent(
    `Hola Buda Belleza, quiero asesoría sobre la línea de ${category.name} para mi negocio.`,
  )}`;

  return (
    <div className="flex flex-col gap-6 pb-12 sm:gap-10">
      <div className="shell pt-4">
        <div className="rounded-hero grain relative flex min-h-[22rem] items-end overflow-hidden shadow-[var(--shadow-e3)] lg:min-h-[26rem]">
          <div className="absolute inset-0">
            <SmartImage
              id={category.imageId}
              alt={`Producto de ${category.name.toLowerCase()} en el almacén de Buda Belleza`}
              width={1920}
              height={720}
              priority
              sizes="100vw"
              wrapperClassName="h-full w-full"
            />
          </div>
          <div
            aria-hidden="true"
            className="from-ink-950/95 via-ink-950/55 absolute inset-0 bg-gradient-to-t to-transparent"
          />
          <div
            aria-hidden="true"
            className="from-ink-950/75 absolute inset-0 bg-gradient-to-r to-transparent"
          />

          <div className="relative z-[2] w-full p-6 sm:p-10 lg:p-14">
            <nav aria-label="Ruta de navegación">
              <ol className="flex flex-wrap items-center gap-x-1.5 gap-y-1 text-xs font-medium text-white/70">
                <li>
                  <Link
                    to="/"
                    className="transition-colors duration-250 ease-[var(--ease-out-quint)] hover:text-white"
                  >
                    Inicio
                  </Link>
                </li>
                <li aria-hidden="true" className="flex items-center">
                  <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                </li>
                <li>
                  <Link
                    to="/catalogo"
                    className="transition-colors duration-250 ease-[var(--ease-out-quint)] hover:text-white"
                  >
                    Catálogo
                  </Link>
                </li>
                <li aria-hidden="true" className="flex items-center">
                  <ChevronRight className="h-3.5 w-3.5 text-white/40" />
                </li>
                <li>
                  <span aria-current="page" className="text-white">
                    {category.name}
                  </span>
                </li>
              </ol>
            </nav>

            <h1 className="font-display text-display-xl mt-4 max-w-3xl font-medium text-white">
              {category.name}
            </h1>
            <p className="text-lead text-ink-200 mt-3 max-w-xl">{category.tagline}</p>

            <div className="mt-6 flex flex-wrap items-center gap-2">
              {category.highlights.map((highlight) => (
                <Badge key={highlight} tone="glass">
                  {highlight}
                </Badge>
              ))}
              <Badge tone="gold" className="tabular-nums">
                {formatReferences(category.productCount)} en catálogo
              </Badge>
            </div>
          </div>
        </div>
      </div>

      <Section tone="canvas" padding="lg" aria-labelledby="linea-title">
        <div className="grid gap-10 lg:grid-cols-[minmax(0,1fr)_21rem] lg:gap-14">
          <Reveal className="flex flex-col gap-4" y={16}>
            <Eyebrow>Sobre la línea</Eyebrow>
            <h2 id="linea-title" className="font-display text-display-md text-ink-900 font-medium">
              Inventario técnico, no surtido improvisado
            </h2>
            <p className="text-lead text-ink-600 max-w-2xl">{category.description}</p>
            <ul className="divide-line border-line mt-4 max-w-2xl divide-y border-t border-b">
              {SERVICE_FACTS.map((fact) => (
                <li key={fact} className="text-ink-700 flex items-start gap-3 py-3.5 text-sm">
                  <Check
                    aria-hidden="true"
                    strokeWidth={2.5}
                    className="text-brand-600 mt-0.5 h-4 w-4 shrink-0"
                  />
                  {fact}
                </li>
              ))}
            </ul>
          </Reveal>

          <Reveal delay={110} y={16}>
            <div className="bg-surface rounded-panel ring-ink-900/[0.05] flex flex-col gap-4 p-6 shadow-[var(--shadow-e1)] ring-1 lg:sticky lg:top-32">
              <Eyebrow tone="gold">Asesoría técnica</Eyebrow>
              <p className="font-display text-display-sm text-ink-900 font-medium">
                ¿No sabes qué línea le conviene a tu cabina?
              </p>
              <p className="text-ink-600 text-sm leading-relaxed">
                Un asesor especializado en {category.name.toLowerCase()} arma tu primer pedido,
                calcula el rendimiento por servicio y te comparte la ficha técnica de cada clave.
              </p>
              <div className="mt-1 flex flex-col gap-2.5">
                <ButtonLink to="/mayoristas" variant="primary" className="w-full">
                  Registrarme como mayorista
                </ButtonLink>
                <ButtonAnchor
                  href={whatsappHref}
                  target="_blank"
                  rel="noopener noreferrer"
                  variant="outline"
                  className="w-full"
                >
                  <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
                  Escribir por WhatsApp
                </ButtonAnchor>
              </div>
              <p className="text-ink-400 text-xs leading-relaxed">
                Respondemos el mismo día hábil. Pedido mínimo de {formatPrice(QUOTE_MINIMUM_MXN)}{' '}
                por orden.
              </p>
            </div>
          </Reveal>
        </div>
      </Section>

      <Section tone="canvas" padding="none" aria-labelledby="productos-title">
        <div className="border-line flex flex-wrap items-end justify-between gap-4 border-b pb-5">
          <div className="flex flex-col gap-2.5">
            <Eyebrow>Disponible en línea</Eyebrow>
            <h2
              id="productos-title"
              className="font-display text-display-md text-ink-900 font-medium"
            >
              {formatInteger(sorted.length)} {sorted.length === 1 ? 'referencia' : 'referencias'} de{' '}
              {category.name.toLowerCase()}
            </h2>
          </div>

          <div className="flex items-center gap-2">
            <label htmlFor={sortId} className="eyebrow text-ink-400 shrink-0">
              Ordenar
            </label>
            <div className="relative">
              <select
                id={sortId}
                value={sort}
                onChange={(event) => setSort(event.target.value as SortKey)}
                className="border-line-strong bg-surface text-ink-800 hover:border-ink-900 h-11 cursor-pointer appearance-none rounded-full border pr-9 pl-4 text-sm font-medium transition-colors duration-250 ease-[var(--ease-out-quint)]"
              >
                {SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
              <ChevronDown
                aria-hidden="true"
                className="text-ink-400 pointer-events-none absolute top-1/2 right-3.5 h-4 w-4 -translate-y-1/2"
              />
            </div>
          </div>
        </div>

        <ProductGrid
          products={sorted}
          columns={4}
          className="mt-8"
          emptyMessage={`Todavía no publicamos claves de ${category.name.toLowerCase()} en línea.`}
        />

        <p className="text-ink-400 mt-8 text-sm leading-relaxed">
          ¿Necesitas una clave que no aparece?{' '}
          <Link
            to="/contacto"
            className="text-brand-600 decoration-brand-200 hover:decoration-brand-600 font-semibold underline decoration-1 underline-offset-4 transition-colors duration-250 ease-[var(--ease-out-quint)]"
          >
            Pídela a tu asesor
          </Link>
          .
        </p>
      </Section>

      <Section tone="canvas" padding="lg" aria-labelledby="otras-title">
        <SectionHeading
          id="otras-title"
          eyebrow="Sigue surtiendo"
          title="Otras especialidades"
          description="Un solo proveedor, una sola factura y una sola entrega para todo lo que consume tu negocio."
          action={
            <ButtonLink to="/catalogo" variant="outline">
              Ver catálogo completo
            </ButtonLink>
          }
        />

        <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-5">
          {others.map((entry, index) => (
            <Reveal as="li" key={entry.slug} delay={Math.min(index, 5) * 60} y={14}>
              <CategoryLinkCard category={entry} />
            </Reveal>
          ))}
        </ul>
      </Section>

      <Section tone="blush" padding="md" aria-labelledby="registro-title">
        <div className="flex flex-col gap-7 md:flex-row md:items-center md:justify-between">
          <Reveal className="flex flex-col gap-3" y={14}>
            <Eyebrow>Precios de mayoreo</Eyebrow>
            <h2
              id="registro-title"
              className="font-display text-display-md text-ink-900 max-w-xl font-medium"
            >
              Registra tu negocio y recibe precios de mayoreo
            </h2>
            <p className="text-ink-600 max-w-lg text-sm leading-relaxed">
              Activamos tu cuenta el mismo día hábil con RFC y comprobante de domicilio. Sin cuota
              anual y sin compra mínima mensual: solo el pedido mínimo de{' '}
              {formatPrice(QUOTE_MINIMUM_MXN)} por orden.
            </p>
          </Reveal>

          <Reveal delay={110} y={14} className="flex flex-col gap-3 sm:flex-row md:shrink-0">
            <ButtonLink to="/mayoristas" variant="primary" size="lg">
              Crear mi cuenta mayorista
              <ArrowRight
                aria-hidden="true"
                className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1"
              />
            </ButtonLink>
            <ButtonAnchor
              href={whatsappHref}
              target="_blank"
              rel="noopener noreferrer"
              variant="outline"
              size="lg"
            >
              <WhatsAppIcon className="h-4 w-4" aria-hidden="true" />
              Hablar con un asesor
            </ButtonAnchor>
          </Reveal>
        </div>
      </Section>
    </div>
  );
}
