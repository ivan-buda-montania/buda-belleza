/**
 * Builds the public catalog from the local POS mirror.
 *
 *   npm run catalog:build
 *
 * Reads db/eleventa.sqlite (see `npm run db:import`) and writes src/data/catalog.json,
 * which is committed so the site builds without the database. Only public fields are
 * written — no costs, prices or sales volumes.
 */

import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { DatabaseSync } from 'node:sqlite';
import type { CategorySlug } from '../../src/types/category.ts';
import type { CatalogFile, CatalogProduct } from '../../src/types/product.ts';
import type { ImageEntry } from './images.ts';
import {
  BESTSELLER_COUNT,
  BESTSELLER_WINDOW_DAYS,
  CATEGORY_RULES,
  INCLUDE,
  NEW_WINDOW_DAYS,
} from './config.ts';

const DB_PATH = resolve('db/eleventa.sqlite');
const OVERRIDES = resolve('scripts/catalog/category-overrides.json');
const IMAGES = resolve('scripts/catalog/product-images.json');
const OUTPUT = resolve('src/data/catalog.json');

interface Row {
  code: string;
  name: string;
  units_out: number;
  first_seen: string | null;
}

/** Upper-case, accent-free, single-spaced — the form config patterns are written in. */
function normalize(text: string): string {
  return ` ${text.normalize('NFD').replace(/[̀-ͯ]/g, '').toUpperCase().replace(/\s+/g, ' ').trim()} `;
}

function slugify(text: string): string {
  return text
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-|-$/g, '');
}

function daysBefore(timestamp: string, days: number): string {
  const date = new Date(`${timestamp.slice(0, 10)}T00:00:00Z`);
  date.setUTCDate(date.getUTCDate() - days);
  return date.toISOString().slice(0, 10);
}

function main(): void {
  if (!existsSync(DB_PATH)) {
    console.error(`${DB_PATH} not found. Run: npm run db:import -- /path/to/Database.fdb`);
    process.exit(1);
  }
  const db = new DatabaseSync(DB_PATH, { readOnly: true });
  const overrides = JSON.parse(readFileSync(OVERRIDES, 'utf8')) as Record<string, CategorySlug>;
  // Photos found by `npm run catalog:images`; only reviewed ("approved") ones are published.
  const images = (existsSync(IMAGES) ? JSON.parse(readFileSync(IMAGES, 'utf8')) : {}) as Record<
    string,
    ImageEntry
  >;
  const imageFor = (code: string) => {
    const entry = images[code];
    return entry?.status === 'approved' &&
      entry.file &&
      existsSync(resolve('public/products', entry.file))
      ? `/products/${entry.file}`
      : undefined;
  };

  const lastMovement = String(
    db.prepare('SELECT MAX(occurred_at) AS last FROM inventory_movements').get()?.last,
  );
  const bestsellerSince = daysBefore(lastMovement, BESTSELLER_WINDOW_DAYS);
  const newSince = daysBefore(lastMovement, NEW_WINDOW_DAYS);

  const rows = db
    .prepare(
      `SELECT p.code, p.name,
              COALESCE(SUM(CASE WHEN m.type = 's' AND m.occurred_at >= ? THEN m.quantity END), 0) AS units_out,
              MIN(m.occurred_at) AS first_seen
       FROM products p
       LEFT JOIN inventory_movements m ON m.product_code = p.code
       GROUP BY p.code`,
    )
    .all(bestsellerSince) as unknown as Row[];

  const published: (CatalogProduct & { unitsOut: number })[] = [];
  for (const row of rows) {
    const name = normalize(row.name);
    const rules = INCLUDE.filter((rule) => rule.patterns.some((p) => name.includes(p)));
    if (rules.length === 0) continue;

    const brand = rules.find((rule) => rule.brand)?.brand;
    const category =
      overrides[row.code] ??
      CATEGORY_RULES.find(([, patterns]) => patterns.some((p) => name.includes(p)))?.[0] ??
      'otros';

    published.push({
      id: row.code,
      name: row.name.trim().replace(/\s+/g, ' '),
      ...(brand ? { brandId: slugify(brand) } : {}),
      categorySlug: category,
      ...(row.first_seen ? { firstSeen: row.first_seen.slice(0, 10) } : {}),
      ...(imageFor(row.code) ? { image: imageFor(row.code) } : {}),
      unitsOut: row.units_out,
    });
  }

  // Tags come from real movements: the top sellers in the window, and first appearances.
  const bestsellers = published
    .filter((product) => product.unitsOut > 0)
    .sort((a, b) => b.unitsOut - a.unitsOut)
    .slice(0, BESTSELLER_COUNT);
  bestsellers.forEach((product, index) => (product.salesRank = index + 1));
  for (const product of published) {
    const tags: CatalogProduct['tags'] = [];
    if (product.salesRank) tags.push('bestseller');
    if (product.firstSeen && product.firstSeen >= newSince) tags.push('new');
    if (tags.length > 0) product.tags = tags;
  }

  const brandNames = [...new Set(INCLUDE.flatMap((rule) => (rule.brand ? [rule.brand] : [])))];
  const catalog: CatalogFile = {
    source: { lastMovementAt: lastMovement },
    brands: brandNames
      .map((name) => ({ id: slugify(name), name }))
      .filter((brand) => published.some((product) => product.brandId === brand.id)),
    products: published
      .sort((a, b) => a.name.localeCompare(b.name, 'es-MX'))
      // Sales volumes stay private; only the resulting rank is published.
      .map(({ unitsOut: _unitsOut, ...product }) => product),
  };

  writeFileSync(OUTPUT, `${JSON.stringify(catalog, null, 2)}\n`);

  const byCategory = new Map<string, number>();
  for (const product of catalog.products) {
    byCategory.set(product.categorySlug, (byCategory.get(product.categorySlug) ?? 0) + 1);
  }
  console.log(`Wrote ${catalog.products.length} products to ${OUTPUT}`);
  for (const [slug, count] of byCategory)
    console.log(`  ${slug.padEnd(12)} ${String(count).padStart(4)}`);
  console.log(
    `  bestsellers ${bestsellers.length} · new ${catalog.products.filter((p) => p.tags?.includes('new')).length}` +
      ` · with photo ${catalog.products.filter((p) => p.image).length}`,
  );
}

main();
