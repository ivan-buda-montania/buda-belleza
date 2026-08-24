export interface BannerCta {
  label: string;
  href: string;
}

export interface Banner {
  id: string;
  /** Unsplash id — resolve through `unsplashUrl` in `lib/images`. */
  imageId: string;
  eyebrow: string;
  headline: string;
  /** Word inside `headline` to render in the display serif accent. */
  accentWord?: string;
  subcopy: string;
  ctaPrimary: BannerCta;
  ctaSecondary?: BannerCta;
  /** Optional badge, e.g. "Vigente hasta el 30 de septiembre". */
  note?: string;
}
