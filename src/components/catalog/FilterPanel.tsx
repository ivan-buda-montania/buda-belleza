import { Check, ChevronDown } from 'lucide-react';
import { useMemo, useRef, type ReactNode } from 'react';
import { brands } from '../../data/brands';
import { categories } from '../../data/categories';
import { products } from '../../data/products';
import { cn } from '../../lib/cn';
import { normalizeText, productMatches } from '../../lib/text';
import { formatInteger } from '../../lib/format';
import type { CategorySlug } from '../../types/category';
import type { Product, ProductTag } from '../../types/product';
import { Button } from '../ui/Button';

export const TAG_LABELS: Record<ProductTag, string> = {
  bestseller: 'Más vendidos',
  new: 'Novedades',
};

const TAG_ORDER: ProductTag[] = ['bestseller', 'new'];

function matchesTags(product: Product, tags: ProductTag[]) {
  return tags.length === 0 || tags.some((tag) => product.tags?.includes(tag));
}

function countBy<K>(key: (product: Product) => K | undefined, keep: (product: Product) => boolean) {
  const counts = new Map<K, number>();
  for (const product of products) {
    const value = key(product);
    if (value === undefined || !keep(product)) continue;
    counts.set(value, (counts.get(value) ?? 0) + 1);
  }
  return counts;
}

interface FilterGroupProps {
  label: string;
  activeCount?: number;
  defaultOpen?: boolean;
  children: ReactNode;
}

function FilterGroup({ label, activeCount = 0, defaultOpen = false, children }: FilterGroupProps) {
  return (
    <details open={defaultOpen} className="group border-line border-t first:border-t-0">
      <summary className="flex min-h-11 cursor-pointer list-none items-center justify-between gap-3 py-3.5 [&::-webkit-details-marker]:hidden">
        <span className="eyebrow text-ink-500 group-open:text-ink-900 transition-colors duration-250 ease-[var(--ease-out-quint)]">
          {label}
        </span>
        <span className="flex items-center gap-2">
          {activeCount > 0 && (
            <span
              aria-hidden="true"
              className="bg-brand-600 flex h-5 min-w-5 items-center justify-center rounded-full px-1.5 text-[0.625rem] leading-none font-bold text-white tabular-nums"
            >
              {activeCount}
            </span>
          )}
          <ChevronDown
            aria-hidden="true"
            className="text-ink-400 h-4 w-4 shrink-0 transition-transform duration-300 ease-[var(--ease-out-quint)] group-open:rotate-180"
          />
        </span>
      </summary>
      <div role="group" aria-label={label} className="pb-5">
        {children}
      </div>
    </details>
  );
}

interface CheckboxRowProps {
  checked: boolean;
  onChange: () => void;
  label: string;
  /** Right-hand slot: facet count, exclusivity dot, etc. */
  trailing?: ReactNode;
  dimmed?: boolean;
}

function CheckboxRow({ checked, onChange, label, trailing, dimmed = false }: CheckboxRowProps) {
  return (
    <label className="hover:bg-ink-50 -mx-2 flex min-h-11 cursor-pointer items-center gap-3 rounded-xl px-2 transition-colors duration-200 ease-[var(--ease-out-quint)]">
      <input type="checkbox" checked={checked} onChange={onChange} className="peer sr-only" />
      <span
        aria-hidden="true"
        className="border-ink-300 bg-surface peer-checked:border-brand-600 peer-checked:bg-brand-600 peer-focus-visible:outline-brand-600 grid h-[1.15rem] w-[1.15rem] shrink-0 place-items-center rounded-[0.4rem] border transition-[background-color,border-color] duration-200 ease-[var(--ease-out-quint)] peer-focus-visible:outline-2 peer-focus-visible:outline-offset-2 peer-checked:[&>svg]:scale-100 peer-checked:[&>svg]:opacity-100"
      >
        <Check
          strokeWidth={3.25}
          className="h-3 w-3 scale-50 text-white opacity-0 transition-[opacity,transform,translate,scale,rotate] duration-200 ease-[var(--ease-spring)]"
        />
      </span>
      <span
        className={cn(
          'flex-1 text-sm leading-snug transition-colors duration-200',
          checked ? 'text-ink-900 font-semibold' : dimmed ? 'text-ink-400' : 'text-ink-700',
        )}
      >
        {label}
      </span>
      {trailing}
    </label>
  );
}

export interface FilterPanelProps {
  selectedCategories: CategorySlug[];
  onToggleCategory: (slug: CategorySlug) => void;
  selectedBrands: string[];
  onToggleBrand: (id: string) => void;
  selectedTags: ProductTag[];
  onToggleTag: (tag: ProductTag) => void;
  onClear: () => void;
  resultCount: number;
  /** Active text query — facet counts must reflect it too. */
  searchTerm?: string;
  className?: string;
}

export function FilterPanel({
  selectedCategories,
  onToggleCategory,
  selectedBrands,
  onToggleBrand,
  selectedTags,
  onToggleTag,
  onClear,
  resultCount,
  searchTerm = '',
  className,
}: FilterPanelProps) {
  const headingRef = useRef<HTMLHeadingElement>(null);
  // Each axis's counts ignore that axis, so a selected option never hides its siblings' tallies.
  const term = normalizeText(searchTerm.trim());
  const categoryCounts = useMemo(
    () =>
      countBy(
        (product) => product.categorySlug,
        (product) =>
          productMatches(product, term) &&
          (selectedBrands.length === 0 ||
            (product.brandId !== undefined && selectedBrands.includes(product.brandId))) &&
          matchesTags(product, selectedTags),
      ),
    [term, selectedBrands, selectedTags],
  );
  const brandCounts = useMemo(
    () =>
      countBy(
        (product) => product.brandId,
        (product) =>
          productMatches(product, term) &&
          (selectedCategories.length === 0 || selectedCategories.includes(product.categorySlug)) &&
          matchesTags(product, selectedTags),
      ),
    [term, selectedCategories, selectedTags],
  );

  const hasActiveFilters =
    selectedCategories.length > 0 || selectedBrands.length > 0 || selectedTags.length > 0;

  return (
    <div className={cn('flex flex-col', className)}>
      <div className="flex items-center justify-between gap-3 pb-3.5">
        <h2
          ref={headingRef}
          tabIndex={-1}
          className="font-display text-ink-900 text-xl font-medium outline-none"
        >
          Filtros
        </h2>
        <Button
          variant="ghost"
          onClick={() => {
            onClear();
            headingRef.current?.focus();
          }}
          disabled={!hasActiveFilters}
          className="-mr-2"
        >
          Limpiar
        </Button>
      </div>

      <FilterGroup label="Categoría" defaultOpen activeCount={selectedCategories.length}>
        <div className="flex flex-col">
          {categories.map((category) => {
            const count = categoryCounts.get(category.slug) ?? 0;
            const checked = selectedCategories.includes(category.slug);

            return (
              <CheckboxRow
                key={category.slug}
                checked={checked}
                onChange={() => onToggleCategory(category.slug)}
                label={category.name}
                dimmed={count === 0 && !checked}
                trailing={
                  <span className="text-ink-400 shrink-0 text-xs tabular-nums">
                    {formatInteger(count)}
                    <span className="sr-only"> referencias</span>
                  </span>
                }
              />
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Marca" defaultOpen activeCount={selectedBrands.length}>
        <div className="no-scrollbar -mr-1 max-h-[22rem] overflow-y-auto pr-1">
          {brands.map((brand) => {
            const count = brandCounts.get(brand.id) ?? 0;
            const checked = selectedBrands.includes(brand.id);

            return (
              <CheckboxRow
                key={brand.id}
                checked={checked}
                onChange={() => onToggleBrand(brand.id)}
                label={brand.name}
                dimmed={count === 0 && !checked}
                trailing={
                  <span className="text-ink-400 shrink-0 text-xs tabular-nums">
                    {formatInteger(count)}
                    <span className="sr-only"> referencias</span>
                  </span>
                }
              />
            );
          })}
        </div>
      </FilterGroup>

      <FilterGroup label="Etiqueta" activeCount={selectedTags.length}>
        <div className="flex flex-wrap gap-2">
          {TAG_ORDER.map((tag) => {
            const active = selectedTags.includes(tag);

            return (
              <button
                key={tag}
                type="button"
                aria-pressed={active}
                onClick={() => onToggleTag(tag)}
                className={cn(
                  'inline-flex h-11 cursor-pointer items-center rounded-full border px-4 text-sm font-medium transition-[background-color,border-color,color,box-shadow,transform,translate,scale,rotate] duration-250 ease-[var(--ease-out-quint)] active:translate-y-px',
                  active
                    ? 'border-brand-600 bg-brand-600 text-white shadow-[var(--shadow-brand)]'
                    : 'border-line-strong text-ink-700 hover:border-ink-900 hover:text-ink-900',
                )}
              >
                {TAG_LABELS[tag]}
              </button>
            );
          })}
        </div>
      </FilterGroup>

      <p className="border-line text-ink-500 border-t pt-4 text-xs">
        {formatInteger(resultCount)}{' '}
        {resultCount === 1 ? 'referencia coincide' : 'referencias coinciden'} con estos filtros
      </p>
    </div>
  );
}
