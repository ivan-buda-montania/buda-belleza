import { CornerDownLeft, Search } from 'lucide-react';
import { useEffect, useId, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { useNavigate } from 'react-router-dom';
import { categoryIconMap } from '../icons/categoryIconMap';
import { getBrandById } from '../../data/brands';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { cn } from '../../lib/cn';
import { normalizeText, productMatches } from '../../lib/text';
import { formatReferences } from '../../lib/format';
import type { Category } from '../../types/category';
import type { Product } from '../../types/product';

interface SearchBarProps {
  onSubmit?: (q: string) => void;
  className?: string;
  autoFocus?: boolean;
}

type Suggestion =
  | { kind: 'category'; key: string; category: Category }
  | { kind: 'product'; key: string; product: Product; detail: string };

const MAX_SUGGESTIONS = 6;

export function SearchBar({ onSubmit, className, autoFocus = false }: SearchBarProps) {
  const navigate = useNavigate();
  const listId = useId();
  const rootRef = useRef<HTMLDivElement>(null);
  const [query, setQuery] = useState('');
  const [open, setOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);

  // Same normalisation as the catalog, so both surfaces resolve a query identically.
  const term = normalizeText(query.trim());

  const suggestions = useMemo<Suggestion[]>(() => {
    if (term.length < 2) return [];

    const categoryHits = categories
      .filter((category) => normalizeText(category.name).includes(term))
      .slice(0, 2)
      .map((category): Suggestion => ({ kind: 'category', key: `cat-${category.slug}`, category }));

    const productHits = products
      .filter((product) => productMatches(product, term))
      .slice(0, MAX_SUGGESTIONS - categoryHits.length)
      .map((product): Suggestion => ({
        kind: 'product',
        key: product.id,
        product,
        detail: [getBrandById(product.brandId)?.name, `Clave ${product.sku}`]
          .filter(Boolean)
          .join(' · '),
      }));

    return [...categoryHits, ...productHits];
  }, [term]);

  const hasPanel = term.length >= 2;
  const optionCount = hasPanel ? suggestions.length + 1 : 0;
  const isOpen = open && hasPanel;

  useEffect(() => {
    if (!isOpen) return;
    const handlePointerDown = (event: PointerEvent) => {
      if (!rootRef.current?.contains(event.target as Node)) setOpen(false);
    };
    document.addEventListener('pointerdown', handlePointerDown);
    return () => document.removeEventListener('pointerdown', handlePointerDown);
  }, [isOpen]);

  const optionId = (index: number) => `${listId}-option-${index}`;

  const goToSearch = (value: string) => {
    setOpen(false);
    onSubmit?.(value);
    navigate(`/catalogo?q=${encodeURIComponent(value)}`);
  };

  const selectSuggestion = (suggestion: Suggestion) => {
    setOpen(false);
    onSubmit?.(query.trim());
    if (suggestion.kind === 'category') {
      navigate(`/categoria/${suggestion.category.slug}`);
      return;
    }
    navigate(`/categoria/${suggestion.product.categorySlug}`);
  };

  const handleKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'Escape') {
      if (isOpen) {
        setOpen(false);
        setActiveIndex(-1);
      } else {
        setQuery('');
        setActiveIndex(-1);
      }
      return;
    }

    if (event.key === 'ArrowDown' || event.key === 'ArrowUp') {
      if (!hasPanel) return;
      event.preventDefault();
      setOpen(true);
      setActiveIndex((current) => {
        if (event.key === 'ArrowDown') return current >= optionCount - 1 ? 0 : current + 1;
        return current <= 0 ? optionCount - 1 : current - 1;
      });
      return;
    }

    if (event.key === 'Enter' && isOpen && activeIndex >= 0 && activeIndex < suggestions.length) {
      event.preventDefault();
      selectSuggestion(suggestions[activeIndex]);
    }
  };

  return (
    <div
      ref={rootRef}
      className={cn('relative', className)}
      onBlur={(event) => {
        if (!rootRef.current?.contains(event.relatedTarget as Node | null)) setOpen(false);
      }}
    >
      <form
        role="search"
        onSubmit={(event) => {
          event.preventDefault();
          const value = query.trim();
          if (value.length === 0) return;
          goToSearch(value);
        }}
        className="group/search bg-ink-100/70 ring-ink-900/[0.07] focus-within:ring-brand-300 focus-within:bg-surface flex h-11 items-center gap-2.5 rounded-full px-4 ring-1 transition-[background-color,box-shadow] duration-250 ease-[var(--ease-out-quint)] focus-within:shadow-[0_0_0_4px_rgb(240_159_198/0.25)]"
      >
        <Search
          className="text-ink-400 group-focus-within/search:text-brand-600 h-4 w-4 shrink-0 transition-colors"
          aria-hidden="true"
        />
        <input
          type="search"
          role="combobox"
          value={query}
          autoFocus={autoFocus}
          onChange={(event) => {
            setQuery(event.target.value);
            setActiveIndex(-1);
            setOpen(true);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKeyDown}
          aria-expanded={isOpen}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={isOpen && activeIndex >= 0 ? optionId(activeIndex) : undefined}
          aria-label="Buscar productos, marcas o SKU"
          placeholder="Busca por producto, marca o SKU"
          className="text-ink-900 placeholder:text-ink-400 h-full w-full min-w-0 bg-transparent text-sm outline-none [&::-webkit-search-cancel-button]:hidden"
        />
      </form>

      {isOpen && (
        <div className="rounded-panel bg-surface ring-ink-900/[0.06] absolute inset-x-0 top-full z-50 mt-2.5 overflow-hidden shadow-[var(--shadow-e4)] ring-1">
          <ul id={listId} role="listbox" aria-label="Sugerencias de búsqueda" className="p-1.5">
            {suggestions.map((suggestion, index) => {
              const active = index === activeIndex;
              const commonClass = cn(
                'rounded-card flex cursor-pointer items-center gap-3 p-2.5 transition-colors',
                active ? 'bg-brand-50' : 'hover:bg-ink-50',
              );

              if (suggestion.kind === 'category') {
                const Icon =
                  categoryIconMap[suggestion.category.icon as keyof typeof categoryIconMap];
                return (
                  <li
                    key={suggestion.key}
                    id={optionId(index)}
                    role="option"
                    aria-selected={active}
                    className={commonClass}
                    onMouseEnter={() => setActiveIndex(index)}
                    onMouseDown={(event) => event.preventDefault()}
                    onClick={() => selectSuggestion(suggestion)}
                  >
                    <span className="bg-brand-50 text-brand-600 grid h-11 w-11 shrink-0 place-items-center rounded-xl">
                      {Icon && <Icon className="h-5 w-5" aria-hidden="true" />}
                    </span>
                    <span className="min-w-0 flex-1">
                      <span className="text-ink-900 block truncate text-sm font-semibold">
                        {suggestion.category.name}
                      </span>
                      <span className="text-ink-500 block text-xs">
                        Categoría · {formatReferences(suggestion.category.productCount)}
                      </span>
                    </span>
                  </li>
                );
              }

              return (
                <li
                  key={suggestion.key}
                  id={optionId(index)}
                  role="option"
                  aria-selected={active}
                  className={commonClass}
                  onMouseEnter={() => setActiveIndex(index)}
                  onMouseDown={(event) => event.preventDefault()}
                  onClick={() => selectSuggestion(suggestion)}
                >
                  {suggestion.product.image ? (
                    <img
                      src={suggestion.product.image}
                      alt=""
                      className="ring-ink-900/[0.06] h-11 w-11 shrink-0 rounded-xl bg-white object-contain p-1 ring-1"
                    />
                  ) : (
                    <span className="bg-ink-100 text-ink-500 grid h-11 w-11 shrink-0 place-items-center rounded-xl">
                      <Search className="h-4 w-4" aria-hidden="true" />
                    </span>
                  )}
                  <span className="min-w-0 flex-1">
                    <span className="text-ink-900 block truncate text-sm font-medium">
                      {suggestion.product.name}
                    </span>
                    <span className="text-ink-500 block truncate text-xs">{suggestion.detail}</span>
                  </span>
                </li>
              );
            })}

            {suggestions.length > 0 && (
              <li role="presentation" aria-hidden="true" className="bg-line mx-2.5 my-1.5 h-px" />
            )}

            <li
              id={optionId(suggestions.length)}
              role="option"
              aria-selected={activeIndex === suggestions.length}
              className={cn(
                'rounded-card flex cursor-pointer items-center gap-2.5 px-3.5 py-3 text-sm font-semibold transition-colors',
                activeIndex === suggestions.length
                  ? 'bg-brand-50 text-brand-700'
                  : 'text-ink-700 hover:bg-ink-50',
              )}
              onMouseEnter={() => setActiveIndex(suggestions.length)}
              onMouseDown={(event) => event.preventDefault()}
              onClick={() => goToSearch(query.trim())}
            >
              <CornerDownLeft className="h-4 w-4 shrink-0" aria-hidden="true" />
              <span className="truncate">Ver todos los resultados de «{query.trim()}»</span>
            </li>
          </ul>
        </div>
      )}
    </div>
  );
}
