import { ChevronDown, Menu, X } from 'lucide-react';
import { useEffect, useId, useRef, useState } from 'react';
import { Link, NavLink, useLocation } from 'react-router-dom';
import { categoryIconMap } from '../icons/categoryIconMap';
import { socialIconMap } from '../icons/socialIconMap';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { socialLinks } from '../../data/social-links';
import { cn } from '../../lib/cn';
import { formatReferences } from '../../lib/format';
import { IMG } from '../../lib/images';
import { ButtonAnchor, ButtonLink } from '../ui/Button';
import { Eyebrow } from '../ui/Eyebrow';
import { SmartImage } from '../ui/SmartImage';
import { AccountMenu } from './AccountMenu';
import { CartQuoteButton } from './CartQuoteButton';
import { Logotype } from './Logotype';
import { SearchBar } from './SearchBar';

const leadingLinks = [
  { label: 'Inicio', to: '/' },
  { label: 'Catálogo', to: '/catalogo' },
];

const trailingLinks = [
  { label: 'Marcas', to: '/marcas' },
  { label: 'Mayoristas', to: '/mayoristas' },
  { label: 'Contacto', to: '/contacto' },
];

const whatsapp = socialLinks.find((link) => link.id === 'whatsapp');

function NavItem({ to, label }: { to: string; label: string }) {
  return (
    <NavLink
      to={to}
      end={to === '/'}
      className={({ isActive }) =>
        cn(
          'group relative inline-flex h-12 items-center px-3 text-sm font-medium transition-colors duration-200',
          isActive ? 'text-brand-600' : 'text-ink-600 hover:text-ink-900',
        )
      }
    >
      {({ isActive }) => (
        <>
          {label}
          <span
            aria-hidden="true"
            className={cn(
              'absolute inset-x-3 bottom-0 h-0.5 origin-center rounded-full transition-transform duration-300 ease-[var(--ease-out-quint)]',
              isActive
                ? 'bg-brand-600 scale-x-100'
                : 'bg-ink-300 scale-x-0 group-hover:scale-x-100',
            )}
          />
        </>
      )}
    </NavLink>
  );
}

export function Navbar() {
  const { pathname, key: locationKey } = useLocation();
  const megaId = useId();
  const drawerId = useId();
  const categoriesPanelId = useId();

  const [condensed, setCondensed] = useState(false);
  const [navFocused, setNavFocused] = useState(false);
  const [megaOpen, setMegaOpen] = useState(false);
  const [megaEverOpened, setMegaEverOpened] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [mobileCategoriesOpen, setMobileCategoriesOpen] = useState(false);

  const megaRef = useRef<HTMLLIElement>(null);
  const megaTriggerRef = useRef<HTMLButtonElement>(null);
  const megaPanelRef = useRef<HTMLDivElement>(null);
  const hoverTimer = useRef<number | undefined>(undefined);

  const hamburgerRef = useRef<HTMLButtonElement>(null);
  const closeDrawerRef = useRef<HTMLButtonElement>(null);
  const drawerPanelRef = useRef<HTMLDivElement>(null);
  const previousMobileOpen = useRef(mobileOpen);

  useEffect(() => {
    const handleScroll = () => {
      const next = window.scrollY > 48;
      setCondensed(next);
      if (next) setMegaOpen(false);
    };
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  useEffect(() => {
    setMegaOpen(false);
    setMobileOpen(false);
  }, [pathname, locationKey]);

  useEffect(() => {
    if (megaOpen) setMegaEverOpened(true);
  }, [megaOpen]);

  // The drawer is `lg:hidden`; widening past lg would strand the body scroll lock.
  useEffect(() => {
    if (!mobileOpen) return;
    const desktop = window.matchMedia('(min-width: 1024px)');
    const close = () => {
      if (desktop.matches) setMobileOpen(false);
    };
    close();
    desktop.addEventListener('change', close);
    return () => desktop.removeEventListener('change', close);
  }, [mobileOpen]);

  useEffect(() => {
    if (!megaOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!megaRef.current?.contains(event.target as Node)) setMegaOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [megaOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const { body, documentElement } = document;
    const scrollbar = window.innerWidth - documentElement.clientWidth;
    const previousOverflow = body.style.overflow;
    const previousPadding = body.style.paddingRight;
    body.style.overflow = 'hidden';
    if (scrollbar > 0) body.style.paddingRight = `${scrollbar}px`;
    return () => {
      body.style.overflow = previousOverflow;
      body.style.paddingRight = previousPadding;
    };
  }, [mobileOpen]);

  useEffect(() => {
    if (!mobileOpen) return;
    const panel = drawerPanelRef.current;
    if (!panel) return;

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setMobileOpen(false);
        return;
      }
      if (event.key !== 'Tab') return;

      const focusables = Array.from(
        panel.querySelectorAll<HTMLElement>(
          'a[href], button:not([disabled]), input, [tabindex]:not([tabindex="-1"])',
        ),
      ).filter((node) => node.offsetWidth > 0 || node.offsetHeight > 0);
      if (focusables.length === 0) return;

      const first = focusables[0];
      const last = focusables[focusables.length - 1];
      if (event.shiftKey && document.activeElement === first) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && document.activeElement === last) {
        event.preventDefault();
        first.focus();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [mobileOpen]);

  useEffect(() => {
    if (previousMobileOpen.current === mobileOpen) return;
    previousMobileOpen.current = mobileOpen;
    if (mobileOpen) closeDrawerRef.current?.focus();
    else hamburgerRef.current?.focus();
  }, [mobileOpen]);

  useEffect(() => () => window.clearTimeout(hoverTimer.current), []);

  const scheduleMegaClose = () => {
    window.clearTimeout(hoverTimer.current);
    hoverTimer.current = window.setTimeout(() => setMegaOpen(false), 140);
  };

  const cancelMegaClose = () => window.clearTimeout(hoverTimer.current);

  const tierTwoCollapsed = condensed && !navFocused;

  return (
    <>
      <header
        className={cn(
          'sticky top-0 z-50 transition-[background-color,box-shadow,border-color] duration-300 ease-[var(--ease-out-quint)]',
          condensed
            ? 'bg-surface/85 border-line border-b shadow-[var(--shadow-e1)] backdrop-blur-xl'
            : 'bg-canvas border-b border-transparent',
        )}
      >
        <div className="shell hidden h-20 items-center gap-6 lg:flex">
          <Link to="/" className="shrink-0 rounded-lg" aria-label="Buda Belleza · Inicio">
            <Logotype />
          </Link>
          <SearchBar className="mx-auto w-full max-w-xl flex-1" />
          <div className="flex shrink-0 items-center gap-2">
            <AccountMenu />
            <CartQuoteButton />
          </div>
        </div>

        <div
          onFocusCapture={() => setNavFocused(true)}
          onBlurCapture={(event) => {
            if (!event.currentTarget.contains(event.relatedTarget as Node | null)) {
              setNavFocused(false);
            }
          }}
          className={cn(
            'hidden transition-opacity duration-200 ease-[var(--ease-out-quint)] lg:block',
            tierTwoCollapsed ? 'h-0 overflow-hidden opacity-0' : 'h-12 opacity-100',
          )}
        >
          <div className="shell">
            <nav aria-label="Navegación principal" className="border-line/70 border-t">
              <ul className="-mx-3 flex items-center">
                {leadingLinks.map((link) => (
                  <li key={link.to}>
                    <NavItem to={link.to} label={link.label} />
                  </li>
                ))}

                <li
                  ref={megaRef}
                  onMouseEnter={() => {
                    cancelMegaClose();
                    setMegaOpen(true);
                  }}
                  onMouseLeave={scheduleMegaClose}
                  onKeyDown={(event) => {
                    if (event.key === 'Escape' && megaOpen) {
                      event.preventDefault();
                      setMegaOpen(false);
                      megaTriggerRef.current?.focus();
                    }
                  }}
                  onBlur={(event) => {
                    if (!megaRef.current?.contains(event.relatedTarget as Node | null)) {
                      setMegaOpen(false);
                    }
                  }}
                >
                  <button
                    ref={megaTriggerRef}
                    type="button"
                    aria-expanded={megaOpen}
                    aria-controls={megaId}
                    onClick={() => setMegaOpen((current) => !current)}
                    onKeyDown={(event) => {
                      if (event.key === 'ArrowDown') {
                        event.preventDefault();
                        setMegaOpen(true);
                        window.requestAnimationFrame(() =>
                          megaPanelRef.current?.querySelector('a')?.focus(),
                        );
                      }
                    }}
                    className={cn(
                      'group relative inline-flex h-12 cursor-pointer items-center gap-1.5 px-3 text-sm font-medium transition-colors duration-200',
                      megaOpen ? 'text-brand-600' : 'text-ink-600 hover:text-ink-900',
                    )}
                  >
                    Categorías
                    <ChevronDown
                      className={cn(
                        'h-3.5 w-3.5 transition-transform duration-250 ease-[var(--ease-out-quint)]',
                        megaOpen && 'rotate-180',
                      )}
                      aria-hidden="true"
                    />
                    <span
                      aria-hidden="true"
                      className={cn(
                        'absolute inset-x-3 bottom-0 h-0.5 origin-center rounded-full transition-transform duration-300 ease-[var(--ease-out-quint)]',
                        megaOpen
                          ? 'bg-brand-600 scale-x-100'
                          : 'bg-ink-300 scale-x-0 group-hover:scale-x-100',
                      )}
                    />
                  </button>

                  <div
                    id={megaId}
                    ref={megaPanelRef}
                    inert={!megaOpen}
                    className={cn(
                      // The wrapper spans the full header width, so only the panel itself may
                      // take pointer events — otherwise it would shadow the page beside it.
                      'pointer-events-none absolute inset-x-0 top-full pt-3 transition-[opacity,transform,translate,scale,rotate] duration-250 ease-[var(--ease-out-quint)]',
                      megaOpen ? 'translate-y-0 opacity-100' : '-translate-y-3 opacity-0',
                    )}
                  >
                    <div className="shell">
                      <div
                        className={cn(
                          'rounded-panel bg-surface ring-ink-900/[0.05] overflow-hidden shadow-[var(--shadow-e4)] ring-1',
                          megaOpen && 'pointer-events-auto',
                        )}
                      >
                        <div className="grid grid-cols-4">
                          <ul className="col-span-3 grid grid-cols-3 gap-1 p-4">
                            {categories.map((category) => {
                              const Icon =
                                categoryIconMap[category.icon as keyof typeof categoryIconMap];
                              return (
                                <li key={category.slug}>
                                  <Link
                                    to={`/categoria/${category.slug}`}
                                    className="group/cat rounded-card hover:bg-ink-50 flex h-full gap-3.5 p-3.5 transition-colors duration-200"
                                  >
                                    <span className="bg-brand-50 text-brand-600 group-hover/cat:bg-brand-600 grid h-10 w-10 shrink-0 place-items-center rounded-xl transition-colors duration-250 group-hover/cat:text-white">
                                      {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                                    </span>
                                    <span className="min-w-0">
                                      <span className="text-ink-900 block text-sm font-semibold">
                                        {category.name}
                                      </span>
                                      <span className="text-ink-500 mt-1 line-clamp-2 block text-xs leading-snug">
                                        {category.tagline}
                                      </span>
                                      <span className="text-ink-500 mt-2 block text-[0.6875rem] font-semibold tracking-[0.04em] tabular-nums">
                                        {formatReferences(category.productCount)}
                                      </span>
                                    </span>
                                  </Link>
                                </li>
                              );
                            })}
                          </ul>

                          <div className="bg-ink-900 relative isolate min-h-[16rem]">
                            <div className="absolute inset-0">
                              {megaEverOpened && (
                                <SmartImage
                                  id={IMG.salonInterior}
                                  alt="Interior de un salón abastecido por Buda Belleza"
                                  width={520}
                                  height={760}
                                  wrapperClassName="h-full w-full"
                                  sizes="22rem"
                                />
                              )}
                            </div>
                            <div
                              aria-hidden="true"
                              className="from-ink-950 via-ink-950/75 absolute inset-0 bg-gradient-to-t to-transparent"
                            />
                            <div className="relative flex h-full flex-col justify-end gap-3.5 p-6">
                              <Eyebrow tone="onDark">Catálogo vigente</Eyebrow>
                              <p className="font-display text-display-sm font-medium text-white">
                                {formatReferences(products.length)} listas para cotizar
                              </p>
                              <ButtonLink
                                to="/catalogo"
                                variant="glass"
                                size="sm"
                                className="self-start"
                              >
                                Explorar el catálogo
                              </ButtonLink>
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </li>

                {trailingLinks.map((link) => (
                  <li key={link.to}>
                    <NavItem to={link.to} label={link.label} />
                  </li>
                ))}
              </ul>
            </nav>
          </div>
        </div>

        <div className="shell flex h-16 items-center justify-between gap-3 lg:hidden">
          <button
            ref={hamburgerRef}
            type="button"
            aria-label={mobileOpen ? 'Cerrar menú' : 'Abrir menú'}
            aria-expanded={mobileOpen}
            aria-controls={drawerId}
            onClick={() => setMobileOpen((current) => !current)}
            className="text-ink-800 hover:bg-ink-100 relative -ml-2.5 grid h-11 w-11 cursor-pointer place-items-center rounded-full transition-colors"
          >
            <Menu
              className={cn(
                'absolute h-6 w-6 transition-[opacity,transform,translate,scale,rotate] duration-250 ease-[var(--ease-out-quint)]',
                mobileOpen ? 'rotate-90 opacity-0' : 'rotate-0 opacity-100',
              )}
              aria-hidden="true"
            />
            <X
              className={cn(
                'absolute h-6 w-6 transition-[opacity,transform,translate,scale,rotate] duration-250 ease-[var(--ease-out-quint)]',
                mobileOpen ? 'rotate-0 opacity-100' : '-rotate-90 opacity-0',
              )}
              aria-hidden="true"
            />
          </button>

          <Link to="/" className="rounded-lg" aria-label="Buda Belleza · Inicio">
            <Logotype />
          </Link>

          <CartQuoteButton />
        </div>
      </header>

      <div
        id={drawerId}
        inert={!mobileOpen}
        className={cn(
          'fixed inset-0 z-60 lg:hidden',
          mobileOpen ? 'pointer-events-auto' : 'pointer-events-none',
        )}
      >
        <button
          type="button"
          tabIndex={-1}
          aria-label="Cerrar menú"
          onClick={() => setMobileOpen(false)}
          className={cn(
            'bg-ink-950/45 absolute inset-0 h-full w-full cursor-default backdrop-blur-sm transition-opacity duration-300 ease-[var(--ease-out-quint)]',
            mobileOpen ? 'opacity-100' : 'opacity-0',
          )}
        />

        <div
          ref={drawerPanelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú principal"
          className={cn(
            'bg-surface absolute inset-y-0 right-0 flex w-[min(22rem,88vw)] flex-col shadow-[var(--shadow-e4)] transition-transform duration-300 ease-[var(--ease-out-quint)]',
            mobileOpen ? 'translate-x-0' : 'translate-x-full',
          )}
        >
          <div className="border-line flex h-16 shrink-0 items-center justify-between border-b px-5">
            <Logotype />
            <button
              ref={closeDrawerRef}
              type="button"
              aria-label="Cerrar menú"
              onClick={() => setMobileOpen(false)}
              className="text-ink-700 hover:bg-ink-100 -mr-2 grid h-11 w-11 cursor-pointer place-items-center rounded-full transition-colors"
            >
              <X className="h-5 w-5" aria-hidden="true" />
            </button>
          </div>

          <div className="flex-1 overflow-y-auto overscroll-contain px-5 py-5">
            <SearchBar onSubmit={() => setMobileOpen(false)} />

            <nav aria-label="Navegación principal móvil" className="mt-6">
              <ul className="flex flex-col">
                {leadingLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      end={link.to === '/'}
                      className={({ isActive }) =>
                        cn(
                          'border-line/70 flex h-12 items-center border-b text-[0.9375rem] font-medium transition-colors',
                          isActive ? 'text-brand-600' : 'text-ink-800 hover:text-brand-600',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}

                <li>
                  <button
                    type="button"
                    aria-expanded={mobileCategoriesOpen}
                    aria-controls={categoriesPanelId}
                    onClick={() => setMobileCategoriesOpen((current) => !current)}
                    className="border-line/70 text-ink-800 flex h-12 w-full cursor-pointer items-center justify-between border-b text-[0.9375rem] font-medium"
                  >
                    Categorías
                    <ChevronDown
                      className={cn(
                        'text-ink-500 h-4 w-4 transition-transform duration-250 ease-[var(--ease-out-quint)]',
                        mobileCategoriesOpen && 'rotate-180',
                      )}
                      aria-hidden="true"
                    />
                  </button>
                  {mobileCategoriesOpen && (
                    <ul id={categoriesPanelId} className="border-line/70 border-b py-2">
                      {categories.map((category) => {
                        const Icon = categoryIconMap[category.icon as keyof typeof categoryIconMap];
                        return (
                          <li key={category.slug}>
                            <Link
                              to={`/categoria/${category.slug}`}
                              className="text-ink-700 hover:text-brand-600 flex h-11 items-center gap-3 text-sm"
                            >
                              <span className="bg-brand-50 text-brand-600 grid h-8 w-8 shrink-0 place-items-center rounded-lg">
                                {Icon && <Icon className="h-4 w-4" aria-hidden="true" />}
                              </span>
                              {category.name}
                            </Link>
                          </li>
                        );
                      })}
                    </ul>
                  )}
                </li>

                {trailingLinks.map((link) => (
                  <li key={link.to}>
                    <NavLink
                      to={link.to}
                      className={({ isActive }) =>
                        cn(
                          'border-line/70 flex h-12 items-center border-b text-[0.9375rem] font-medium transition-colors',
                          isActive ? 'text-brand-600' : 'text-ink-800 hover:text-brand-600',
                        )
                      }
                    >
                      {link.label}
                    </NavLink>
                  </li>
                ))}
              </ul>
            </nav>
          </div>

          <div className="border-line shrink-0 border-t px-5 py-5">
            <div className="flex flex-col gap-2.5">
              <ButtonLink to="/mayoristas" variant="primary" size="md" className="w-full">
                Registrarme como mayorista
              </ButtonLink>
              {whatsapp && (
                <ButtonAnchor
                  href={whatsapp.href}
                  target="_blank"
                  rel="noreferrer"
                  variant="outline"
                  size="md"
                  className="w-full"
                >
                  Hablar por WhatsApp
                </ButtonAnchor>
              )}
            </div>

            <ul className="mt-5 flex items-center gap-2.5">
              {socialLinks.map((link) => {
                const Icon = socialIconMap[link.id];
                return (
                  <li key={link.id}>
                    <a
                      href={link.href}
                      target="_blank"
                      rel="noreferrer"
                      aria-label={`${link.label} de Buda Belleza`}
                      className="border-line text-ink-600 hover:border-ink-900 hover:text-ink-900 grid h-11 w-11 place-items-center rounded-full border transition-colors"
                    >
                      <Icon className="h-[1.15rem] w-[1.15rem]" aria-hidden="true" />
                    </a>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </div>
    </>
  );
}
