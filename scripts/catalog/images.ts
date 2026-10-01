/**
 * Finds product photos on each brand's official site and stores them in public/products.
 *
 *   npm run catalog:images     then     npm run catalog:build
 *
 * 1. Lists every product (title, page, image) published by each brand's official site, plus
 *    retailer stores that carry the brands. Shopify variants with their own photo (one per dye
 *    shade) count as separate products.
 * 2. Matches them by name to catalog products of the same brand. Dye shades (10.02, 1A) and
 *    peroxide volumes (20 vol) must agree exactly; a wrong photo is worse than none. Official
 *    sources win; a retailer photo is used only when no official one matches, and only at a
 *    higher score.
 * 3. Records each match in scripts/catalog/product-images.json for review. "auto" entries are
 *    proposals and are recomputed each run; set them to "approved" (published), "rejected" (that
 *    image is wrong; another may be proposed next run) or "none" (never look for this product
 *    again, e.g. sachets or names too vague to identify). Only approved photos are published.
 * 4. Downloads each image once, resized to at most 800px, as WebP in public/products/.
 */

import { createHash } from 'node:crypto';
import { existsSync, mkdirSync, readdirSync, readFileSync, rmSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { setTimeout as sleep } from 'node:timers/promises';
import sharp from 'sharp';
import type { CatalogFile } from '../../src/types/product.ts';

const CATALOG = resolve('src/data/catalog.json');
const MAPPING = resolve('scripts/catalog/product-images.json');
const OUT_DIR = resolve('public/products');
const USER_AGENT = 'Mozilla/5.0 (X11; Linux x86_64) AppleWebKit/537.36 Chrome/130 Safari/537.36';
const MIN_SCORE: Record<Tier, number> = { official: 0.6, retailer: 0.85 };
/** Bump when the image processing below changes, so existing files are regenerated. */
const PROCESSING_VERSION = 2;

type Tier = 'official' | 'retailer';

interface Source {
  brandId: string;
  tier: Tier;
  title: string;
  page: string;
  image: string;
  /** One page for a whole product line (all sizes/volumes), so volume codes aren't enforced. */
  line?: boolean;
}

export interface ImageEntry {
  status: 'auto' | 'approved' | 'rejected' | 'none';
  /** Absent on entries recorded before retailers were added; those are all official. */
  tier?: Tier;
  title: string;
  page: string;
  image: string;
  score: number;
  /** File name in public/products once downloaded. */
  file?: string;
  /** Images a reviewer already turned down for this product; never proposed again. */
  rejectedImages?: string[];
}

// ── Fetching ────────────────────────────────────────────────────────────────

async function get(url: string): Promise<Response> {
  const response = await fetch(url, { headers: { 'user-agent': USER_AGENT } });
  if (!response.ok) throw new Error(`${response.status} ${url}`);
  return response;
}

function decodeEntities(text: string): string {
  const named: Record<string, string> = {
    amp: '&',
    quot: '"',
    apos: "'",
    lt: '<',
    gt: '>',
    nbsp: ' ',
  };
  return text
    .replace(/&#x([0-9a-f]+);/gi, (_, hex: string) => String.fromCodePoint(parseInt(hex, 16)))
    .replace(/&#(\d+);/g, (_, dec: string) => String.fromCodePoint(Number(dec)))
    .replace(/&([a-z]+);/gi, (match, name: string) => named[name.toLowerCase()] ?? match);
}

async function paginate<T>(pageUrl: (page: number) => string, pick: (body: unknown) => T[]) {
  const all: T[] = [];
  for (let page = 1; page < 50; page++) {
    const response = await fetch(pageUrl(page), { headers: { 'user-agent': USER_AGENT } });
    if (!response.ok) break; // WordPress answers 400 past the last page
    const items = pick(await response.json());
    if (items.length === 0) break;
    all.push(...items);
  }
  return all;
}

/**
 * Shopify feed. `brandOf` assigns each product a catalog brand (or skips it); variants with
 * their own photo, typically one per dye shade, become separate sources.
 */
async function shopify(
  base: string,
  tier: Tier,
  brandOf: (text: string) => string | undefined,
): Promise<Source[]> {
  type Variant = { id: number; title: string; featured_image: { src: string } | null };
  type Item = {
    title: string;
    handle: string;
    vendor: string;
    images: { src: string }[];
    variants: Variant[];
  };
  const items = await paginate(
    (page) => `${base}/products.json?limit=250&page=${page}`,
    (body) => (body as { products: Item[] }).products,
  );
  return items.flatMap((item) => {
    const brandId = brandOf(`${item.title} ${item.vendor}`);
    if (!brandId) return [];
    const page = `${base}/products/${item.handle}`;
    const sources: Source[] = [];
    if (item.images.length > 0) {
      sources.push({ brandId, tier, title: item.title, page, image: item.images[0].src });
    }
    for (const variant of item.variants) {
      if (!variant.featured_image || variant.title === 'Default Title') continue;
      sources.push({
        brandId,
        tier,
        title: `${item.title} ${variant.title}`,
        page: `${page}?variant=${variant.id}`,
        image: variant.featured_image.src,
      });
    }
    return sources;
  });
}

const BRAND_PATTERNS: [string, RegExp][] = [
  ['nefertiti', /NEFERTITI/],
  ['nutrapel', /NUTRAPEL/],
  ['voglia', /VOGLIA/],
  ['kuul', /\bKUUL\b/],
  ['vittale', /VITTALE/],
  ['ouro', /\bOURO\b/],
];

/** Retailers sell many brands: keep products that name exactly one catalog brand. */
function detectBrand(text: string): string | undefined {
  const normalized = text
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toUpperCase();
  const found = BRAND_PATTERNS.filter(([, pattern]) => pattern.test(normalized));
  return found.length === 1 ? found[0][0] : undefined;
}

async function woocommerce(brandId: string, base: string): Promise<Source[]> {
  type Item = { name: string; permalink: string; images: { src: string }[] };
  const items = await paginate(
    (page) => `${base}/wp-json/wc/store/v1/products?per_page=100&page=${page}`,
    (body) => body as Item[],
  );
  return items
    .filter((item) => item.images.length > 0)
    .map((item) => ({
      brandId,
      tier: 'official' as const,
      title: decodeEntities(item.name),
      page: item.permalink,
      image: item.images[0].src,
    }));
}

async function wordpressPortfolio(brandId: string, base: string): Promise<Source[]> {
  type Item = {
    title: { rendered: string };
    link: string;
    _embedded?: { 'wp:featuredmedia'?: { source_url: string }[] };
  };
  const items = await paginate(
    (page) => `${base}/wp-json/wp/v2/portfolio?per_page=100&page=${page}&_embed=wp:featuredmedia`,
    (body) => body as Item[],
  );
  return items.flatMap((item) => {
    const image = item._embedded?.['wp:featuredmedia']?.[0]?.source_url;
    return image
      ? [
          {
            brandId,
            tier: 'official' as const,
            title: decodeEntities(item.title.rendered),
            page: item.link,
            image,
          },
        ]
      : [];
  });
}

/** Wix store sitemaps list each product URL with its images; the slug is the product name. */
async function wixSitemap(brandId: string, sitemapUrl: string): Promise<Source[]> {
  const xml = await (await get(sitemapUrl)).text();
  return [...xml.matchAll(/<url>([\s\S]*?)<\/url>/g)].flatMap(([, block]) => {
    const page = /<loc>([^<]+)<\/loc>/.exec(block)?.[1];
    const image = /<image:loc>([^<]+)<\/image:loc>/.exec(block)?.[1];
    if (!page || !image) return [];
    const slug = page.split('/').pop() ?? '';
    const title = slug.replace(/-\d+$/, '').replaceAll('-', ' ');
    return [{ brandId, tier: 'official' as const, title, page, image }];
  });
}

/** Henkel's Küül site: one page per product line, under /productos/<line>/<product>.html. */
async function kuul(): Promise<Source[]> {
  const base = 'https://www.kuulcolor.com.mx';
  const xml = await (await get(`${base}/es.sitemap.pages-sitemap.xml`)).text();
  const pages = [...xml.matchAll(/<loc>([^<]+)<\/loc>/g)]
    .map(([, url]) => url)
    .filter((url) => /\/productos\/[^/]+\/[^/]+\.html$/.test(url));

  const sources: Source[] = [];
  for (const page of pages) {
    const html = await (await get(page)).text();
    const title = /<h1[^>]*>([^<]+)/.exec(html)?.[1]?.trim();
    const image = /<meta property="og:image" content="([^"]+)"/.exec(html)?.[1];
    if (title && image)
      sources.push({
        brandId: 'kuul',
        tier: 'official',
        title: decodeEntities(title),
        page,
        image,
        line: true,
      });
    await sleep(300);
  }
  return sources;
}

/** Official brand sites. Voglia has two: Voglia Color (salon colour) and Voglia Hombre (barber). */
const OFFICIAL: [string, () => Promise<Source[]>][] = [
  ['nefertiti.com.mx', () => woocommerce('nefertiti', 'https://nefertiti.com.mx')],
  [
    'tienda.nutrapel.com',
    () => shopify('https://tienda.nutrapel.com', 'official', () => 'nutrapel'),
  ],
  ['vittale.com', () => wordpressPortfolio('vittale', 'https://vittale.com')],
  ['vogliacolor.com', () => shopify('https://vogliacolor.com', 'official', () => 'voglia')],
  ['vogliahombre.com', () => shopify('https://vogliahombre.com', 'official', () => 'voglia')],
  ['ouro.com.mx', () => wixSitemap('ouro', 'https://www.ouro.com.mx/store-products-sitemap.xml')],
  ['kuulcolor.com.mx', kuul],
];

/**
 * Mexican beauty retailers whose Shopify feeds carry the catalog brands. Excluded on purpose:
 * fantasycolor.mx (watermarks its photos) and elpalaciodelabelleza.com.mx (10k products, no
 * per-shade photos).
 */
const RETAILERS = [
  'https://chik.mx',
  'https://distribuidoramairim.com',
  'https://www.circulodebelleza.com',
  'https://perfumerialamora.com',
  'https://probell.com.mx',
  'https://eterbella.com.mx',
  'https://claubeautymzt.com',
  'https://barbellbelleza.com',
  'https://www.odara.mx',
  'https://cremaslaniquerena.com',
];

async function listSources(): Promise<Source[]> {
  const jobs: [string, () => Promise<Source[]>][] = [
    ...OFFICIAL,
    ...RETAILERS.map((base): [string, () => Promise<Source[]>] => [
      new URL(base).hostname.replace(/^www\./, ''),
      () => shopify(base, 'retailer', detectBrand),
    ]),
  ];
  const all: Source[] = [];
  for (const [name, job] of jobs) {
    try {
      const found = await job();
      console.log(`  ${name.padEnd(26)} ${String(found.length).padStart(5)} images`);
      all.push(...found);
    } catch (error) {
      // One unreachable store must not stop the others.
      console.warn(`  ${name.padEnd(26)} skipped: ${(error as Error).message}`);
    }
  }
  return all;
}

// ── Matching ────────────────────────────────────────────────────────────────

const ABBREVIATIONS: Record<string, string> = {
  SH: 'SHAMPOO',
  ACOND: 'ACONDICIONADOR',
  TRAT: 'TRATAMIENTO',
  TRATAM: 'TRATAMIENTO',
  AMP: 'AMPOLLETAS',
  AMPOLLETA: 'AMPOLLETAS',
  PEROX: 'PEROXIDO',
  MASC: 'MASCARILLA',
  MASK: 'MASCARILLA',
  DEC: 'DECOLORANTE',
  TNTE: 'TINTE',
  F: 'FUNNY',
  REF: 'REFLECTS',
  REFLECT: 'REFLECTS',
  MOUSE: 'MOUSSE',
};

const IGNORED = new Set([
  // brand and sub-brand names: every candidate already shares the brand
  ...['NEFERTITI', 'NEFER', 'NUTRAPEL', 'NNUTRAPEL', 'KUUL', 'VITTALE', 'OURO', 'VOGLIA', 'HOMBRE'],
  ...[
    'DE',
    'DEL',
    'LA',
    'LAS',
    'EL',
    'LOS',
    'CON',
    'PARA',
    'Y',
    'EN',
    'P',
    'C',
    'THE',
    'TODO',
    'TIPO',
  ],
  ...['PZA', 'PZAS', 'PIEZAS', 'CAJA', 'ML', 'G', 'GR', 'GRS', 'L', 'LT', 'LTS', 'KG', 'OZ'],
  ...['TONO', 'TONOS', 'PROFESIONAL', 'PROFESSIONAL'],
]);

interface Tokens {
  words: string[];
  /** Codes that must agree exactly: dye shades and peroxide volumes. */
  keys: Set<string>;
}

function tokenize(name: string): Tokens {
  const text = name
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .toUpperCase()
    .replace(/\bC\s*\/\s*\d+/g, ' ') // "c/10" pack counts
    // Alternate shade codes ("Tinte 6.22 … / 6.66") name a different shade elsewhere in the
    // line, so they must not satisfy a shade match.
    .replace(/\/\s*\d{1,2}(?:\.\d{1,3})?\b/g, ' ')
    .replace(
      /\b\d+(?:[.,]\d+)?\s*(?:ML|G|GR|GRS|GRAMOS|L|LT|LTS|LITROS?|KG|OZ|PZAS?|PIEZAS)\b\.?/g,
      ' ',
    )
    .replace(/\b(\d+)\s*(?:VOLUMENES|VOLS?|V)\b\.?/g, ' $1VOL ')
    .replace(/[^A-Z0-9.]+/g, ' ');

  const isDye = /\bT(?:I)?NTE\b/.test(text);
  const words: string[] = [];
  const keys = new Set<string>();
  for (let token of text.split(' ')) {
    token = token.replace(/^\.+|\.+$/g, '');
    if (!token || IGNORED.has(token)) continue;
    if (/^\d+VOL$/.test(token)) keys.add(token);
    else if (/^\d{1,3}(?:\.\d{1,3})?[A-Z]?$/.test(token)) {
      // Bare numbers are sizes or pack counts, except on dyes, where they are the shade.
      if (isDye) keys.add(token.replace(/\.0$/, ''));
    } else words.push(ABBREVIATIONS[token] ?? token);
  }
  return { words, keys };
}

function similar(a: string, b: string): boolean {
  if (a === b) return true;
  if (Math.min(a.length, b.length) >= 4 && (a.startsWith(b) || b.startsWith(a))) return true;
  if (Math.min(a.length, b.length) < 6 || Math.abs(a.length - b.length) > 1) return false;
  // One edit apart ("ANTIOXID" / "ANTIOXZID").
  let i = 0;
  let j = 0;
  let edits = 0;
  while (i < a.length && j < b.length) {
    if (a[i] !== b[j]) {
      if (++edits > 1) return false;
      // Skip the extra letter in the longer word; on equal lengths it is a substitution.
      if (a.length > b.length) {
        i++;
        continue;
      }
      if (b.length > a.length) {
        j++;
        continue;
      }
    }
    i++;
    j++;
  }
  return edits + (a.length - i) + (b.length - j) <= 1;
}

/** Dice coefficient over fuzzy-matched words, gated by shade/volume agreement. */
function score(product: Tokens, source: Tokens, line: boolean): number {
  if (!line && [...product.keys].some((key) => !source.keys.has(key))) return 0;
  const unused = [...source.words];
  let matched = 0;
  for (const word of product.words) {
    const index = unused.findIndex((candidate) => similar(word, candidate));
    if (index >= 0) {
      matched++;
      unused.splice(index, 1);
    }
  }
  // A dye is identified by its shade: when the codes agree and every word of the POS name is
  // present ("TINTE NEFERTITI 7.3" → "Tinte 7.3 Rubio Medio Dorado"), it is the same product.
  // More than a shade plus its alternate code means a multi-shade listing, not one shade.
  if (
    !line &&
    product.words.includes('TINTE') &&
    product.keys.size > 0 &&
    source.keys.size <= 2 &&
    matched === product.words.length
  ) {
    return 1;
  }
  const total = product.words.length + source.words.length;
  if (total === 0) return 0;
  const dice = (2 * matched) / total;
  // A specific shade/volume photo for a product that names none is a weaker match.
  return product.keys.size === 0 && source.keys.size > 0 && !line ? dice * 0.8 : dice;
}

// ── Main ────────────────────────────────────────────────────────────────────

/** Approved photos are published; auto ones are kept on disk for review. */
function hasPhoto(entry: ImageEntry): boolean {
  return entry.status === 'approved' || entry.status === 'auto';
}

function fileFor(imageUrl: string): string {
  const key = `${PROCESSING_VERSION}:${imageUrl}`;
  return `${createHash('sha1').update(key).digest('hex').slice(0, 12)}.webp`;
}

async function download(entry: ImageEntry): Promise<string> {
  const file = fileFor(entry.image);
  const target = resolve(OUT_DIR, file);
  if (!existsSync(target)) {
    const buffer = Buffer.from(await (await get(entry.image)).arrayBuffer());
    // Official shots often sit in wide plain margins; trim them so products fill the card.
    await sharp(buffer)
      .trim({ threshold: 18 })
      .resize(800, 800, { fit: 'inside', withoutEnlargement: true })
      .webp({ quality: 80 })
      .toFile(target);
  }
  return file;
}

async function main(): Promise<void> {
  const catalog = JSON.parse(readFileSync(CATALOG, 'utf8')) as CatalogFile;
  const previous: Record<string, ImageEntry> = existsSync(MAPPING)
    ? JSON.parse(readFileSync(MAPPING, 'utf8'))
    : {};

  console.log('Listing official product images…');
  const sources = (await listSources()).map((source) => ({
    source,
    tokens: tokenize(source.title),
  }));

  const mapping: Record<string, ImageEntry> = {};
  for (const product of catalog.products) {
    const kept = previous[product.id];
    if (kept?.status === 'approved' || kept?.status === 'none') {
      mapping[product.id] = kept;
      continue;
    }
    // A rejection rules out that image, not the product: look again among the others.
    const rejectedImages = [
      ...(kept?.rejectedImages ?? []),
      ...(kept?.status === 'rejected' ? [kept.image] : []),
    ];
    if (kept?.status === 'rejected') mapping[product.id] = { ...kept, rejectedImages };
    if (!product.brandId) continue;

    const tokens = tokenize(product.name);
    const best: Partial<Record<Tier, { source: Source; value: number }>> = {};
    for (const candidate of sources) {
      if (candidate.source.brandId !== product.brandId) continue;
      if (rejectedImages.includes(candidate.source.image)) continue;
      const { tier } = candidate.source;
      const value = score(tokens, candidate.tokens, candidate.source.line ?? false);
      if (value > (best[tier]?.value ?? 0)) best[tier] = { source: candidate.source, value };
    }
    // Official photos first, unless a retailer has a strictly better match (an exact
    // retailer listing beats a loose official one); retailers must also clear a higher bar.
    const { official, retailer } = best;
    const officialOk = official && official.value >= MIN_SCORE.official;
    const retailerOk = retailer && retailer.value >= MIN_SCORE.retailer;
    const chosen =
      officialOk && (!retailerOk || official.value >= retailer.value)
        ? official
        : retailerOk
          ? retailer
          : undefined;
    if (chosen) {
      mapping[product.id] = {
        status: 'auto',
        tier: chosen.source.tier,
        title: chosen.source.title,
        page: chosen.source.page,
        image: chosen.source.image,
        score: Math.round(chosen.value * 100) / 100,
        ...(rejectedImages.length > 0 ? { rejectedImages } : {}),
      };
    }
  }

  console.log('Downloading images…');
  mkdirSync(OUT_DIR, { recursive: true });
  for (const entry of Object.values(mapping)) {
    if (hasPhoto(entry)) entry.file = await download(entry);
  }

  // Drop files no longer referenced, so rejected or re-matched photos don't linger.
  const used = new Set(
    Object.values(mapping).flatMap((e) => (hasPhoto(e) && e.file ? [e.file] : [])),
  );
  for (const file of readdirSync(OUT_DIR)) {
    if (file.endsWith('.webp') && !used.has(file)) rmSync(resolve(OUT_DIR, file));
  }

  const sorted = Object.fromEntries(Object.entries(mapping).sort(([a], [b]) => a.localeCompare(b)));
  writeFileSync(MAPPING, `${JSON.stringify(sorted, null, 2)}\n`);

  const active = Object.values(mapping).filter(hasPhoto);
  console.log(
    `Matched ${active.length} of ${catalog.products.length} products (${used.size} distinct images). ` +
      `Review ${MAPPING}, then run npm run catalog:build.`,
  );
}

await main();
