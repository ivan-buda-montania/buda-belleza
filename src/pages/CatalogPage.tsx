import { ChevronDown, Search, SlidersHorizontal, X } from 'lucide-react';
import { useCallback, useEffect, useId, useMemo, useRef, useState } from 'react';
import { useSearchParams } from 'react-router-dom';
import { FilterPanel, TAG_LABELS } from '../components/catalog/FilterPanel';
import { ProductGrid } from '../components/product/ProductGrid';
import { Button } from '../components/ui/Button';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { brands, getBrandById } from '../data/brands';
import { categories, getCategoryBySlug } from '../data/categories';
import { products } from '../data/products';
import { cn } from '../lib/cn';
import { normalizeText, productMatches } from '../lib/text';
import { formatInteger, formatPrice } from '../lib/format';
import type { CategorySlug } from '../types/category';
import type { Product, ProductTag } from '../types/product';

type SortKey = 'relevancia' | 'precio-asc' | 'precio-desc' | 'nombre' | 'novedades';

const PAGE_SIZE = 24;

const SORT_OPTIONS: { value: SortKey; label: string }[] = [
  { value: 'relevancia', label: 'Relevancia' },
  { value: 'precio-asc', label: 'Precio: menor a mayor' },
  { value: 'precio-desc', label: 'Precio: mayor a menor' },
  { value: 'nombre', label: 'Nombre A-Z' },
  { value: 'novedades', label: 'Novedades' },
];

const TAG_VALUES: ProductTag[] = ['bestseller', 'new', 'volume-offer'];
const CATEGORY_SLUGS = new Set<string>(categories.map((category) => category.slug));
const BRAND_IDS = new Set<string>(brands.map((brand) => brand.id));

const PRICE_CEILING =
  Math.ceil(Math.max(...products.map((product) => product.price.wholesale)) / 50) * 50;

const TOTAL_SKUS = categories.reduce((total, category) => total + category.skuCount, 0);

const FOCUSABLE =
  'a[href], button:not([disabled]), input:not([disabled]), select:not([disabled]), summary, [tabindex]:not([tabindex="-1"])';

function relevance(product: Product, term: string) {
  let score = 0;
  if (term.length > 0) {
    const name = normalizeText(product.name);
    if (name.startsWith(term)) score += 8;
    else if (name.includes(term)) score += 5;
    if (normalizeText(product.sku).includes(term)) score += 3;
  }
  if (product.tags?.includes('bestseller')) score += 2;
  if (product.tags?.includes('new')) score += 1;
  if (product.stock === 'in-stock') score += 1;
  return score;
}

function isNew(product: Product) {
  return product.tags?.includes('new') ?? false;
}

function sortProducts(list: Product[], sort: SortKey, term: string) {
  const next = [...list];
  switch (sort) {
    case 'precio-asc':
      return next.sort((a, b) => a.price.wholesale - b.price.wholesale);
    case 'precio-desc':
      return next.sort((a, b) => b.price.wholesale - a.price.wholesale);
    case 'nombre':
      return next.sort((a, b) => a.name.localeCompare(b.name, 'es-MX'));
    case 'novedades':
      return next.sort((a, b) => Number(isNew(b)) - Number(isNew(a)));
    default:
      return next.sort((a, b) => relevance(b, term) - relevance(a, term));
  }
}

function isSortKey(value: string | null): value is SortKey {
  return SORT_OPTIONS.some((option) => option.value === value);
}

function parseList(value: string | null) {
  return (value ?? '').split(',').filter(Boolean);
}

interface ActiveChip {
  key: string;
  label: string;
  onRemove: () => void;
}

export function CatalogPage() {
  const [searchParams, setSearchParams] = useSearchParams();
  const searchId = useId();
  const sortId = useId();
  const sheetId = useId();

  const [sheetOpen, setSheetOpen] = useState(false);
  // Pagination is keyed to the query string, so any filter change resets it during render.
  const [pagination, setPagination] = useState({ key: '', count: PAGE_SIZE });

  const sheetRef = useRef<HTMLDivElement>(null);
  const sheetCloseRef = useRef<HTMLButtonElement>(null);
  const endMarkerRef = useRef<HTMLParagraphElement>(null);
  const focusEndMarker = useRef(false);

  const catParam = searchParams.get('cat');
  const brandParam = searchParams.get('marca');
  const tagParam = searchParams.get('tag');
  const urlQuery = searchParams.get('q') ?? '';
  const inStockOnly = searchParams.get('stock') === '1';
  const sortParam = searchParams.get('orden');
  const sort: SortKey = isSortKey(sortParam) ? sortParam : 'relevancia';

  const parsedMax = Number.parseInt(searchParams.get('max') ?? '', 10);
  const maxPrice = Number.isNaN(parsedMax)
    ? PRICE_CEILING
    : Math.min(Math.max(parsedMax, 0), PRICE_CEILING);

  const selectedCategories = useMemo(
    () => parseList(catParam).filter((slug): slug is CategorySlug => CATEGORY_SLUGS.has(slug)),
    [catParam],
  );
  const selectedBrands = useMemo(
    () => parseList(brandParam).filter((id) => BRAND_IDS.has(id)),
    [brandParam],
  );
  const selectedTags = useMemo(
    () =>
      parseList(tagParam).filter((tag): tag is ProductTag =>
        TAG_VALUES.includes(tag as ProductTag),
      ),
    [tagParam],
  );

  const [searchInput, setSearchInput] = useState(urlQuery);
  const committedQuery = useRef(urlQuery);

  useEffect(() => {
    document.title = 'Catálogo mayorista — Buda Belleza';
  }, []);

  const updateParams = useCallback(
    (mutate: (next: URLSearchParams) => void) => {
      setSearchParams(
        (current) => {
          const next = new URLSearchParams(current);
          mutate(next);
          return next;
        },
        { replace: true },
      );
    },
    [setSearchParams],
  );

  // The URL can also change from the outside (navbar search, back button).
  useEffect(() => {
    if (urlQuery === committedQuery.current) return;
    committedQuery.current = urlQuery;
    setSearchInput(urlQuery);
  }, [urlQuery]);

  useEffect(() => {
    if (searchInput === committedQuery.current) return;
    const timer = window.setTimeout(() => {
      committedQuery.current = searchInput;
      updateParams((next) => {
        if (searchInput.trim().length > 0) next.set('q', searchInput);
        else next.delete('q');
      });
    }, 200);
    return () => window.clearTimeout(timer);
  }, [searchInput, updateParams]);

  const toggleValue = useCallback(
    (key: string, value: string) => {
      updateParams((next) => {
        const current = parseList(next.get(key));
        const updated = current.includes(value)
          ? current.filter((entry) => entry !== value)
          : [...current, value];
        if (updated.length > 0) next.set(key, updated.join(','));
        else next.delete(key);
      });
    },
    [updateParams],
  );

  const handleToggleCategory = useCallback(
    (slug: CategorySlug) => toggleValue('cat', slug),
    [toggleValue],
  );
  const handleToggleBrand = useCallback((id: string) => toggleValue('marca', id), [toggleValue]);
  const handleToggleTag = useCallback((tag: ProductTag) => toggleValue('tag', tag), [toggleValue]);

  const handleToggleInStock = useCallback(() => {
    updateParams((next) => {
      if (next.get('stock') === '1') next.delete('stock');
      else next.set('stock', '1');
    });
  }, [updateParams]);

  const handlePriceChange = useCallback(
    (value: number) => {
      updateParams((next) => {
        if (value >= PRICE_CEILING) next.delete('max');
        else next.set('max', String(value));
      });
    },
    [updateParams],
  );

  const handleClearFilters = useCallback(() => {
    updateParams((next) => {
      for (const key of ['cat', 'marca', 'tag', 'stock', 'max']) next.delete(key);
    });
  }, [updateParams]);

  const handleClearAll = useCallback(() => {
    setSearchInput('');
    updateParams((next) => {
      for (const key of ['cat', 'marca', 'tag', 'stock', 'max', 'q']) next.delete(key);
    });
  }, [updateParams]);

  const term = normalizeText(urlQuery.trim());

  const filtered = useMemo(
    () =>
      products.filter((product) => {
        if (selectedCategories.length > 0 && !selectedCategories.includes(product.categorySlug)) {
          return false;
        }
        if (selectedBrands.length > 0 && !selectedBrands.includes(product.brandId)) return false;
        if (selectedTags.length > 0 && !selectedTags.some((tag) => product.tags?.includes(tag))) {
          return false;
        }
        if (inStockOnly && product.stock !== 'in-stock') return false;
        if (product.price.wholesale > maxPrice) return false;
        if (!productMatches(product, term)) return false;
        return true;
      }),
    [selectedCategories, selectedBrands, selectedTags, inStockOnly, maxPrice, term],
  );

  const sorted = useMemo(() => sortProducts(filtered, sort, term), [filtered, sort, term]);

  const resultsKey = searchParams.toString();
  const visibleCount = pagination.key === resultsKey ? pagination.count : PAGE_SIZE;
  const visible = useMemo(() => sorted.slice(0, visibleCount), [sorted, visibleCount]);

  useEffect(() => {
    if (!focusEndMarker.current) return;
    focusEndMarker.current = false;
    endMarkerRef.current?.focus();
  }, [visibleCount]);

  const activeFilterCount =
    selectedCategories.length +
    selectedBrands.length +
    selectedTags.length +
    (inStockOnly ? 1 : 0) +
    (maxPrice < PRICE_CEILING ? 1 : 0);

  const activeChips = useMemo<ActiveChip[]>(() => {
    const chips: ActiveChip[] = [];

    if (urlQuery.trim().length > 0) {
      chips.push({
        key: 'q',
        label: `Búsqueda: «${urlQuery.trim()}»`,
        onRemove: () => {
          setSearchInput('');
          updateParams((next) => next.delete('q'));
        },
      });
    }

    for (const slug of selectedCategories) {
      const category = getCategoryBySlug(slug);
      chips.push({
        key: `cat-${slug}`,
        label: category?.name ?? slug,
        onRemove: () => handleToggleCategory(slug),
      });
    }

    for (const id of selectedBrands) {
      chips.push({
        key: `marca-${id}`,
        label: getBrandById(id)?.name ?? id,
        onRemove: () => handleToggleBrand(id),
      });
    }

    for (const tag of selectedTags) {
      chips.push({
        key: `tag-${tag}`,
        label: TAG_LABELS[tag],
        onRemove: () => handleToggleTag(tag),
      });
    }

    if (inStockOnly) {
      chips.push({
        key: 'stock',
        label: 'Solo en existencia',
        onRemove: handleToggleInStock,
      });
    }

    if (maxPrice < PRICE_CEILING) {
      chips.push({
        key: 'max',
        label: `Hasta ${formatPrice(maxPrice)}`,
        onRemove: () => handlePriceChange(PRICE_CEILING),
      });
    }

    return chips;
  }, [
    urlQuery,
    selectedCategories,
    selectedBrands,
    selectedTags,
    inStockOnly,
    maxPrice,
    updateParams,
    handleToggleCategory,
    handleToggleBrand,
    handleToggleTag,
    handleToggleInStock,
    handlePriceChange,
  ]);

  const closeSheet = useCallback(() => setSheetOpen(false), []);

  useEffect(() => {
    if (!sheetOpen) return;

    const previouslyFocused = document.activeElement as HTMLElement | null;
    const { overflow, paddingRight } = document.body.style;
    const scrollbarWidth = window.innerWidth - document.documentElement.clientWidth;

    document.body.style.overflow = 'hidden';
    if (scrollbarWidth > 0) document.body.style.paddingRight = `${scrollbarWidth}px`;
    sheetCloseRef.current?.focus();

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        event.preventDefault();
        setSheetOpen(false);
        return;
      }
      if (event.key !== 'Tab' || !sheetRef.current) return;

      const focusable = Array.from(sheetRef.current.querySelectorAll<HTMLElement>(FOCUSABLE));
      if (focusable.length === 0) return;

      const first = focusable[0];
      const last = focusable[focusable.length - 1];
      const active = document.activeElement;

      if (event.shiftKey && (active === first || !sheetRef.current.contains(active))) {
        event.preventDefault();
        last.focus();
      } else if (!event.shiftKey && (active === last || !sheetRef.current.contains(active))) {
        event.preventDefault();
        first.focus();
      }
    };

    const desktop = window.matchMedia('(min-width: 1024px)');
    const onBreakpointChange = () => {
      if (desktop.matches) setSheetOpen(false);
    };

    document.addEventListener('keydown', onKeyDown);
    desktop.addEventListener('change', onBreakpointChange);

    return () => {
      document.removeEventListener('keydown', onKeyDown);
      desktop.removeEventListener('change', onBreakpointChange);
      document.body.style.overflow = overflow;
      document.body.style.paddingRight = paddingRight;
      previouslyFocused?.focus();
    };
  }, [sheetOpen]);

  const handleLoadMore = () => {
    const next = Math.min(visibleCount + PAGE_SIZE, sorted.length);
    // The button unmounts once everything is loaded — hand focus to the status line.
    focusEndMarker.current = next >= sorted.length;
    setPagination({ key: resultsKey, count: next });
  };

  const filterPanel = (
    <FilterPanel
      selectedCategories={selectedCategories}
      onToggleCategory={handleToggleCategory}
      selectedBrands={selectedBrands}
      onToggleBrand={handleToggleBrand}
      selectedTags={selectedTags}
      onToggleTag={handleToggleTag}
      inStockOnly={inStockOnly}
      onToggleInStock={handleToggleInStock}
      maxPrice={maxPrice}
      priceCeiling={PRICE_CEILING}
      onPriceChange={handlePriceChange}
      onClear={handleClearFilters}
      resultCount={sorted.length}
      searchTerm={urlQuery}
    />
  );

  const facts = [
    { value: formatInteger(TOTAL_SKUS), label: 'SKUs en almacén' },
    { value: formatInteger(brands.length), label: 'marcas en línea' },
    { value: formatInteger(categories.length), label: 'categorías' },
  ];

  return (
    <div className="flex flex-col gap-6 pb-12 sm:gap-10">
      <Section tone="ink" padding="md" className="grain" aria-labelledby="catalogo-title">
        <div className="relative z-[2] flex flex-col gap-5">
          <Reveal className="flex flex-col gap-4" y={14}>
            <Eyebrow tone="onDark">Catálogo mayorista</Eyebrow>
            <h1
              id="catalogo-title"
              className="font-display text-display-xl max-w-4xl font-medium text-white"
            >
              Todo el inventario, con precio de mayoreo a la vista
            </h1>
            <p className="text-lead text-ink-300 max-w-2xl">
              Filtra por especialidad, marca, etiqueta o presupuesto y arma tu pedido en minutos.
              Publicamos en línea las claves de mayor rotación; si necesitas una referencia que no
              aparece, tu asesor la cotiza el mismo día hábil.
            </p>
          </Reveal>

          <Reveal delay={110} y={12}>
            <dl className="flex flex-wrap gap-x-6 gap-y-5 sm:gap-x-8">
              {facts.map((fact, index) => (
                <div
                  key={fact.label}
                  className={cn(
                    'flex flex-col gap-1.5',
                    index > 0 && 'sm:border-l sm:border-white/15 sm:pl-8',
                  )}
                >
                  <dt className="eyebrow text-ink-300 order-2">{fact.label}</dt>
                  <dd className="font-display order-1 text-2xl leading-none font-semibold text-white tabular-nums sm:text-3xl">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </Section>

      <Section tone="canvas" padding="lg" aria-labelledby="resultados-title">
        <h2 id="resultados-title" className="sr-only">
          Resultados del catálogo
        </h2>

        <div className="grid gap-10 lg:grid-cols-[17rem_1fr] xl:gap-12">
          <aside className="no-scrollbar sticky top-32 -m-1 hidden max-h-[calc(100vh-9rem)] self-start overflow-y-auto p-1 lg:block">
            <div className="bg-surface rounded-panel ring-ink-900/[0.05] p-5 shadow-[var(--shadow-e1)] ring-1">
              {filterPanel}
            </div>
          </aside>

          <div className="flex min-w-0 flex-col gap-5">
            <div className="bg-surface rounded-panel ring-ink-900/[0.05] flex flex-col gap-3 p-3 shadow-[var(--shadow-e1)] ring-1 xl:flex-row xl:items-center xl:gap-4 xl:p-3.5">
              <div className="flex min-w-0 flex-1 items-center gap-2">
                <div className="relative min-w-0 flex-1">
                  <label htmlFor={searchId} className="sr-only">
                    Buscar en el catálogo por producto, marca o SKU
                  </label>
                  <Search
                    aria-hidden="true"
                    className="text-ink-400 pointer-events-none absolute top-1/2 left-4 h-4 w-4 -translate-y-1/2"
                  />
                  <input
                    id={searchId}
                    type="search"
                    value={searchInput}
                    onChange={(event) => setSearchInput(event.target.value)}
                    placeholder="Busca por producto, marca o SKU"
                    className="bg-ink-100/70 ring-ink-900/[0.07] focus:bg-surface focus:ring-brand-300 text-ink-900 placeholder:text-ink-400 h-11 w-full rounded-full pr-12 pl-11 text-sm ring-1 transition-[background-color,box-shadow] duration-250 ease-[var(--ease-out-quint)] outline-none [&::-webkit-search-cancel-button]:hidden"
                  />
                  {searchInput.length > 0 && (
                    <button
                      type="button"
                      onClick={() => setSearchInput('')}
                      aria-label="Borrar la búsqueda"
                      className="text-ink-400 hover:bg-ink-200 hover:text-ink-900 absolute top-1/2 right-1 flex h-9 w-9 -translate-y-1/2 cursor-pointer items-center justify-center rounded-full transition-colors duration-250 ease-[var(--ease-out-quint)]"
                    >
                      <X className="h-4 w-4" aria-hidden="true" />
                    </button>
                  )}
                </div>

                <Button
                  variant="outline"
                  onClick={() => setSheetOpen(true)}
                  aria-expanded={sheetOpen}
                  aria-controls={sheetId}
                  className="shrink-0 px-4 lg:hidden"
                >
                  <SlidersHorizontal className="h-4 w-4" aria-hidden="true" />
                  Filtros
                  {activeFilterCount > 0 && (
                    <span className="bg-brand-600 group-hover/btn:text-brand-700 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.625rem] leading-none font-bold text-white tabular-nums transition-colors duration-250 group-hover/btn:bg-white">
                      {activeFilterCount}
                      <span className="sr-only"> filtros activos</span>
                    </span>
                  )}
                </Button>
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 xl:flex-nowrap xl:justify-end xl:gap-4">
                <p aria-live="polite" className="text-ink-500 text-sm tabular-nums">
                  <span className="text-ink-900 font-semibold">{formatInteger(sorted.length)}</span>{' '}
                  {sorted.length === 1 ? 'referencia' : 'referencias'}
                </p>

                <div className="flex min-w-0 items-center gap-2">
                  <label htmlFor={sortId} className="eyebrow text-ink-400 shrink-0">
                    Ordenar
                  </label>
                  <div className="relative min-w-0">
                    <select
                      id={sortId}
                      value={sort}
                      onChange={(event) => {
                        const value = event.target.value;
                        updateParams((next) => {
                          if (value === 'relevancia') next.delete('orden');
                          else next.set('orden', value);
                        });
                      }}
                      className="border-line-strong bg-surface text-ink-800 hover:border-ink-900 h-11 w-full max-w-full cursor-pointer appearance-none rounded-full border pr-9 pl-4 text-sm font-medium text-ellipsis transition-colors duration-250 ease-[var(--ease-out-quint)]"
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
            </div>

            {activeChips.length > 0 && (
              <div className="flex flex-wrap items-center gap-2">
                <span className="eyebrow text-ink-400 mr-1">Filtros activos</span>
                {activeChips.map((chip) => (
                  <button
                    key={chip.key}
                    type="button"
                    onClick={chip.onRemove}
                    aria-label={`Quitar filtro ${chip.label}`}
                    className="group/chip border-line-strong bg-surface text-ink-700 hover:border-brand-300 hover:bg-brand-50 hover:text-brand-700 inline-flex h-11 cursor-pointer items-center gap-2 rounded-full border px-4 text-sm font-medium transition-[color,background-color,border-color] duration-250 ease-[var(--ease-out-quint)]"
                  >
                    <span className="max-w-[13rem] truncate">{chip.label}</span>
                    <X
                      aria-hidden="true"
                      className="text-ink-400 group-hover/chip:text-brand-600 h-3.5 w-3.5 shrink-0 transition-colors duration-250"
                    />
                  </button>
                ))}
                <button
                  type="button"
                  onClick={handleClearAll}
                  className="text-ink-500 hover:text-brand-700 inline-flex h-11 cursor-pointer items-center px-2 text-sm font-semibold underline decoration-1 underline-offset-4 transition-colors duration-250 ease-[var(--ease-out-quint)]"
                >
                  Limpiar todo
                </button>
              </div>
            )}

            <ProductGrid
              products={visible}
              columns={3}
              emptyMessage={
                term.length > 0
                  ? `Sin resultados para «${urlQuery.trim()}»`
                  : 'No encontramos productos con estos filtros.'
              }
            />

            {sorted.length === 0 && activeChips.length > 0 && (
              <div className="flex justify-center">
                <Button variant="outline" size="lg" onClick={handleClearAll}>
                  Limpiar todos los filtros
                </Button>
              </div>
            )}

            {sorted.length > 0 && (
              <div className="mt-6 flex flex-col items-center gap-4">
                <div aria-hidden="true" className="rule-fade w-full max-w-md" />
                <p ref={endMarkerRef} tabIndex={-1} className="text-ink-500 text-sm tabular-nums">
                  Mostrando {formatInteger(visible.length)} de {formatInteger(sorted.length)}{' '}
                  {sorted.length === 1 ? 'referencia' : 'referencias'}
                </p>
                {visible.length < sorted.length ? (
                  <Button variant="outline" size="lg" onClick={handleLoadMore}>
                    Ver más productos
                  </Button>
                ) : (
                  <p className="text-ink-400 max-w-md text-center text-xs leading-relaxed">
                    ¿Buscas una clave que no aparece? Manejamos {formatInteger(TOTAL_SKUS)} SKUs en
                    almacén y conseguimos sobre pedido lo que no está publicado.
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </Section>

      <div
        aria-hidden="true"
        onClick={closeSheet}
        className={cn(
          'bg-ink-950/50 fixed inset-0 z-[60] backdrop-blur-sm transition-opacity duration-300 ease-[var(--ease-out-quint)] lg:hidden',
          sheetOpen ? 'opacity-100' : 'pointer-events-none opacity-0',
        )}
      />

      <div
        ref={sheetRef}
        id={sheetId}
        role="dialog"
        aria-modal="true"
        aria-label="Filtros del catálogo"
        aria-hidden={!sheetOpen}
        className={cn(
          'bg-surface rounded-t-panel-lg fixed inset-x-0 bottom-0 z-[65] flex max-h-[85vh] flex-col shadow-[var(--shadow-e4)] lg:hidden',
          'transition-[translate,visibility] duration-[320ms] ease-[var(--ease-out-quint)]',
          sheetOpen ? 'visible translate-y-0' : 'pointer-events-none invisible translate-y-full',
        )}
      >
        <div className="relative shrink-0 px-5 pt-3">
          <span aria-hidden="true" className="bg-ink-200 mx-auto block h-1.5 w-12 rounded-full" />
          <button
            ref={sheetCloseRef}
            type="button"
            onClick={closeSheet}
            aria-label="Cerrar los filtros"
            className="text-ink-500 hover:bg-ink-100 hover:text-ink-900 absolute top-1 right-3 flex h-11 w-11 cursor-pointer items-center justify-center rounded-full transition-colors duration-250 ease-[var(--ease-out-quint)]"
          >
            <X className="h-5 w-5" aria-hidden="true" />
          </button>
        </div>

        <div className="min-h-0 flex-1 overflow-y-auto px-5 pt-2 pb-4">{filterPanel}</div>

        <div className="border-line bg-surface border-t px-5 pt-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
          <Button variant="primary" size="lg" onClick={closeSheet} className="w-full">
            Ver {formatInteger(sorted.length)} {sorted.length === 1 ? 'producto' : 'productos'}
          </Button>
        </div>
      </div>
    </div>
  );
}
