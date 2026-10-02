import { ArrowRight, MoveLeft } from 'lucide-react';
import { Link } from 'react-router-dom';
import { categoryIconMap } from '../components/icons/categoryIconMap';
import { ButtonLink } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { categories } from '../data/categories';

export function NotFoundPage() {
  return (
    <Section tone="canvas" padding="lg" aria-labelledby="error-404-title">
      <div className="grid min-h-[60vh] place-items-center">
        <div className="relative isolate flex w-full max-w-3xl flex-col items-center overflow-x-clip text-center">
          <span
            aria-hidden="true"
            className="font-display text-display-2xl text-brand-100 pointer-events-none absolute inset-x-0 -top-2 -z-10 origin-top scale-[1.7] leading-none font-semibold select-none"
          >
            404
          </span>

          <Reveal className="flex flex-col items-center gap-5 pt-16 sm:pt-24" y={22}>
            <Eyebrow tone="muted">Página no encontrada</Eyebrow>
            <h1
              id="error-404-title"
              className="font-display text-display-xl text-ink-900 font-medium"
            >
              No encontramos esta página
            </h1>
            <p className="text-lead text-ink-600 max-w-xl">
              Es probable que el enlace haya cambiado al reorganizar el catálogo o que la clave que
              buscabas ya se haya dado de baja. Tu carrito sigue guardado: desde aquí puedes
              retomarlo en el punto donde la dejaste.
            </p>
            <div className="mt-3 flex w-full flex-col items-center gap-3 sm:w-auto sm:flex-row">
              <ButtonLink to="/" variant="primary" size="lg" className="w-full sm:w-auto">
                <MoveLeft className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:-translate-x-1" />
                Volver al inicio
              </ButtonLink>
              <ButtonLink to="/catalogo" variant="outline" size="lg" className="w-full sm:w-auto">
                Ver catálogo
                <ArrowRight className="h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)] group-hover/btn:translate-x-1" />
              </ButtonLink>
            </div>
          </Reveal>

          <Reveal delay={140} className="mt-14 flex w-full flex-col items-center gap-7" y={14}>
            <div aria-hidden="true" className="rule-fade w-full max-w-xl" />
            <p className="eyebrow text-ink-500">O entra directo a una especialidad</p>
            <nav aria-label="Categorías del catálogo" className="w-full">
              <ul className="flex flex-wrap justify-center gap-2.5">
                {categories.map((category) => {
                  const Icon = categoryIconMap[category.icon as keyof typeof categoryIconMap];
                  return (
                    <li key={category.slug}>
                      <Link
                        to={`/categoria/${category.slug}`}
                        className="group border-line bg-surface text-ink-700 hover:border-line-strong hover:text-ink-900 inline-flex h-11 items-center gap-2 rounded-full border px-4 text-sm font-medium transition-[color,border-color,box-shadow,transform,translate,scale,rotate] duration-250 ease-[var(--ease-out-quint)] hover:-translate-y-0.5 hover:shadow-[var(--shadow-e2)]"
                      >
                        <Icon
                          aria-hidden="true"
                          className="text-brand-500 group-hover:text-brand-600 h-4 w-4 transition-colors duration-250 ease-[var(--ease-out-quint)]"
                        />
                        {category.name}
                      </Link>
                    </li>
                  );
                })}
              </ul>
            </nav>
            <p className="text-ink-500 mt-3 text-sm">
              ¿Buscas una marca que no aparece?{' '}
              <Link
                to="/contacto"
                className="text-brand-600 decoration-brand-200 hover:decoration-brand-600 font-semibold underline decoration-1 underline-offset-4 transition-colors duration-250 ease-[var(--ease-out-quint)]"
              >
                escríbenos y la conseguimos
              </Link>
              .
            </p>
          </Reveal>
        </div>
      </div>
    </Section>
  );
}
