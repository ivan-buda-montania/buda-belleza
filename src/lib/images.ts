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
