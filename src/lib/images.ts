/**
 * Curated Unsplash photography for the demo catalog.
 *
 * Every id below was hand-picked for the section it serves. `unsplashUrl` builds a
 * cropped, quality-capped, auto-format URL so the browser gets AVIF/WebP where it can.
 * Swap `IMG` for the client's own asset URLs before production — nothing else changes.
 */

export interface UnsplashOptions {
  width: number;
  height?: number;
  quality?: number;
  /** Bias the crop toward faces — useful for portraits used as avatars. */
  faces?: boolean;
}

export function unsplashUrl(id: string, options: UnsplashOptions): string {
  const { width, height, quality = 72, faces = false } = options;
  const params = new URLSearchParams({
    auto: 'format',
    fit: 'crop',
    q: String(quality),
    w: String(width),
  });
  if (height) params.set('h', String(height));
  if (faces) params.set('crop', 'faces,entropy');
  return `https://images.unsplash.com/photo-${id}?${params.toString()}`;
}

const SRCSET_STEPS = [0.5, 0.75, 1, 1.5, 2] as const;

/**
 * Build a `srcset` with width (`w`) descriptors. Density (`1x`/`2x`) descriptors would make
 * the `sizes` attribute inert, forcing phones to download the desktop-sized asset.
 */
export function unsplashSrcSet(id: string, width: number, height?: number, faces = false): string {
  const ratio = height ? height / width : undefined;
  const widths = [...new Set(SRCSET_STEPS.map((step) => Math.round(width * step)))].filter(
    (candidate) => candidate >= 64,
  );

  return widths
    .map((candidate) => {
      const url = unsplashUrl(id, {
        width: candidate,
        height: ratio ? Math.round(candidate * ratio) : undefined,
        quality: candidate > width ? 62 : 72,
        faces,
      });
      return `${url} ${candidate}w`;
    })
    .join(', ');
}

export const IMG = {
  // ── Hero -----------------------------------------------------------------
  heroColor: '1470259078422-826894b933aa',
  heroBarber: '1585747860715-2ba37e788b70',
  heroCosmetics: '1631730486572-226d1f595b68',
  heroSalon: '1633681926022-84c23e8cb2d6',

  // ── Categories -----------------------------------------------------------
  catTintes: '1580618672591-eb180b1a973f',
  catCapilar: '1522337360788-8b13dee7a37e',
  catBarberia: '1599351431202-1e0f0137899a',
  catUnas: '1607779097040-26e80aa78e66',
  catAccesorios: '1527799820374-dcf8d9d4a388',
  catCosmeticos: '1596462502278-27bfdc403348',

  // ── Institutional --------------------------------------------------------
  teamAdvisors: '1559599101-f09722fb4948',
  salonInterior: '1560066984-138dadb4c035',
  warehouseLineup: '1631729371254-42c2892f0e6e',
  barberTools: '1621607512214-68297480165e',

  // ── Testimonial portraits ------------------------------------------------
  faceA: '1487412720507-e7ab37603c6f',
  faceB: '1583001809873-a128495da465',
  faceC: '1617391258031-f8d80b22fb35',
  faceD: '1599351431202-1e0f0137899a',
} as const;

/**
 * Product photography pools, one per category. Products are assigned round-robin
 * with a per-category offset so no two neighbours in a grid share a photo.
 */
/**
 * Product photography pools, one per category. The pools are disjoint so a mixed grid
 * ("Lo más nuevo" pulls from every category) never shows the same shot twice in a row.
 */
/**
 * Product photography pools, one per category. The pools are disjoint so a mixed grid
 * ("Lo más nuevo" pulls from every category) never repeats a shot side by side, and each
 * pool is picked to read plausibly for its specialty.
 */
export const PRODUCT_IMAGE_POOL: Record<string, string[]> = {
  tintes: [
    '1556228720-195a672e8a03',
    '1571781926291-c477ebfd024b',
    '1580870069867-74c57ee1bb07',
    '1620916566398-39f1143ab7be',
    '1608248543803-ba4f8c70ae0b',
    '1470259078422-826894b933aa',
  ],
  capilar: [
    '1526947425960-945c6e72858f',
    '1619451334792-150fd785ee74',
    '1598440947619-2c35fc9aa908',
    '1631729371254-42c2892f0e6e',
    '1522337360788-8b13dee7a37e',
    '1580618672591-eb180b1a973f',
  ],
  barberia: [
    '1621607512214-68297480165e',
    '1503951914875-452162b0f3f1',
    '1599351431202-1e0f0137899a',
    '1527799820374-dcf8d9d4a388',
    '1522338140262-f46f5913618a',
    '1585747860715-2ba37e788b70',
  ],
  unas: [
    '1607779097040-26e80aa78e66',
    '1604654894610-df63bc536371',
    '1519014816548-bf5fe059798b',
    '1610992015732-2449b76344bc',
    '1586495777744-4413f21062fa',
    '1625093742435-6fa192b6fb10',
  ],
  accesorios: [
    '1596462502278-27bfdc403348',
    '1596704017254-9b121068fb31',
    '1560066984-138dadb4c035',
    '1633681926022-84c23e8cb2d6',
    '1571875257727-256c39da42af',
    '1522337094846-8a818192de1f',
  ],
  cosmeticos: [
    '1522335789203-aabd1fc54bc9',
    '1512496015851-a90fb38ba796',
    '1512207846876-bb54ef5056fe',
    '1587017539504-67cfbddac569',
    '1594035910387-fea47794261f',
    '1631730486572-226d1f595b68',
  ],
};

export function productImageId(categorySlug: string, index: number): string {
  const pool = PRODUCT_IMAGE_POOL[categorySlug] ?? PRODUCT_IMAGE_POOL.cosmeticos;
  const offset = categorySlug.length;
  return pool[(index + offset) % pool.length];
}
