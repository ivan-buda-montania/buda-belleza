import { ChevronRight } from 'lucide-react';
import { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { ButtonLink } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { getLegalDocument, legalDocuments } from '../data/legal';

export function LegalPage() {
  // Each legal document has its own top-level path, so the slug comes from the URL itself.
  const { pathname } = useLocation();
  const document_ = getLegalDocument(pathname.replace(/^\/+|\/+$/g, ''));

  useEffect(() => {
    document.title = document_
      ? `${document_.title} — Buda Belleza`
      : 'Documento no encontrado — Buda Belleza';
  }, [document_]);

  if (!document_) {
    return (
      <Section tone="canvas" padding="lg" className="grid min-h-[50vh] place-items-center">
        <div className="max-w-lg text-center">
          <h1 className="font-display text-display-lg text-ink-900 font-medium">
            No encontramos este documento
          </h1>
          <p className="text-ink-600 mt-3">
            Revisa el enlace o consulta cualquiera de nuestros documentos legales.
          </p>
          <ul className="mt-7 flex flex-wrap justify-center gap-2.5">
            {legalDocuments.map((item) => (
              <li key={item.slug}>
                <ButtonLink to={`/${item.slug}`} variant="outline" size="sm">
                  {item.title}
                </ButtonLink>
              </li>
            ))}
          </ul>
        </div>
      </Section>
    );
  }

  return (
    <>
      <Section tone="ink" padding="md" className="grain">
        <Reveal className="max-w-3xl">
          <nav aria-label="Ruta de navegación" className="mb-5">
            <ol className="flex flex-wrap items-center gap-1.5 text-sm text-white/60">
              <li>
                <Link to="/" className="hover:text-white">
                  Inicio
                </Link>
              </li>
              <ChevronRight aria-hidden="true" className="h-3.5 w-3.5" />
              <li aria-current="page" className="text-white/85">
                {document_.title}
              </li>
            </ol>
          </nav>
          <Eyebrow tone="onDark">{document_.eyebrow}</Eyebrow>
          <h1 className="font-display text-display-xl mt-3.5 font-medium text-white">
            {document_.title}
          </h1>
          <p className="text-lead text-ink-300 mt-4">{document_.summary}</p>
          <p className="text-ink-300 mt-6 text-sm">Última actualización: {document_.updated}</p>
        </Reveal>
      </Section>

      <Section tone="canvas" padding="lg">
        <div className="grid gap-12 lg:grid-cols-[16rem_1fr]">
          <nav aria-label="Contenido del documento" className="lg:sticky lg:top-32 lg:self-start">
            <p className="eyebrow text-ink-400 mb-4">En esta página</p>
            <ul className="flex flex-col gap-1">
              {document_.sections.map((section, index) => (
                <li key={section.heading}>
                  <a
                    href={`#seccion-${index + 1}`}
                    className="text-ink-600 hover:text-brand-700 hover:border-brand-400 border-line block border-l-2 py-1.5 pl-3 text-sm transition-colors"
                  >
                    {section.heading}
                  </a>
                </li>
              ))}
            </ul>
          </nav>

          <div className="max-w-2xl">
            {document_.sections.map((section, index) => (
              <Reveal
                key={section.heading}
                as="section"
                delay={index * 50}
                id={`seccion-${index + 1}`}
                className="border-line scroll-mt-32 border-t py-8 first:border-t-0 first:pt-0"
              >
                <h2 className="font-display text-display-sm text-ink-900 font-medium">
                  {section.heading}
                </h2>
                {section.body.map((paragraph) => (
                  <p key={paragraph} className="text-ink-600 mt-4 leading-relaxed">
                    {paragraph}
                  </p>
                ))}
              </Reveal>
            ))}

            <div className="bg-surface ring-line rounded-panel mt-10 p-7 ring-1">
              <p className="text-ink-700">
                ¿Tienes dudas sobre este documento? Escríbenos a{' '}
                <a
                  href="mailto:ventas@budabelleza.mx"
                  className="text-brand-700 font-semibold underline underline-offset-4"
                >
                  ventas@budabelleza.mx
                </a>{' '}
                o habla con tu asesor asignado.
              </p>
              <ButtonLink to="/contacto" variant="outline" size="sm" className="mt-5">
                Ir a contacto
              </ButtonLink>
            </div>
          </div>
        </div>
      </Section>
    </>
  );
}
