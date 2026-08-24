import type { SVGProps } from 'react';

/**
 * lucide-react ships no brand marks, so these are original simplified glyphs drawn on the
 * same 24x24 grid. They are solid fills because stroked approximations fall apart at the
 * 16–24px sizes we use — swap them for the official brand assets before production.
 */

export function WhatsAppIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      {/* Bubble: outer contour wound clockwise, inner counter-clockwise, tail clockwise,
          so the default non-zero fill leaves the ring hollow and unions the tail. */}
      <path d="M2.3 11.6a9.7 9.7 0 1 1 19.4 0 9.7 9.7 0 1 1-19.4 0zM4.2 11.6a7.8 7.8 0 1 0 15.6 0 7.8 7.8 0 1 0-15.6 0zM6.86 19.83 2.95 20.65l.82-3.91z" />
      <path d="M9.3 7A7.7 7.7 0 0 0 17 14.7a1.5 1.5 0 0 0 0-3A4.7 4.7 0 0 1 12.3 7a1.5 1.5 0 0 0-3 0z" />
    </svg>
  );
}

export function FacebookIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M12 1.8a10.2 10.2 0 1 0 0 20.4 10.2 10.2 0 1 0 0-20.4zM9.54 21.9V15.15H7.43V12.04h2.11V10.75C9.54 7.4 11.2 5.62 14.6 5.62h2.13V8.7h-1.18c-1.6 0-2.31.8-2.31 2.4v.94h3.33l-.67 3.11h-2.66v6.97A10.2 10.2 0 0 1 9.54 21.9z"
      />
    </svg>
  );
}

export function InstagramIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M7.8 1.6h8.4a6.2 6.2 0 0 1 6.2 6.2v8.4a6.2 6.2 0 0 1-6.2 6.2H7.8a6.2 6.2 0 0 1-6.2-6.2V7.8a6.2 6.2 0 0 1 6.2-6.2zm0 1.9h8.4a4.3 4.3 0 0 1 4.3 4.3v8.4a4.3 4.3 0 0 1-4.3 4.3H7.8a4.3 4.3 0 0 1-4.3-4.3V7.8a4.3 4.3 0 0 1 4.3-4.3zM12 7.95a4.05 4.05 0 1 0 0 8.1 4.05 4.05 0 1 0 0-8.1zm0 1.9a2.15 2.15 0 1 1 0 4.3 2.15 2.15 0 0 1 0-4.3zm5.4-4.45a1.2 1.2 0 1 0 0 2.4 1.2 1.2 0 0 0 0-2.4z"
      />
    </svg>
  );
}

export function TikTokIcon(props: SVGProps<SVGSVGElement>) {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" {...props}>
      <path
        fillRule="evenodd"
        d="M13.1 2.1h3.5c.07 1.3.52 2.63 1.45 3.54.93.95 2.24 1.38 3.52 1.53v3.42c-1.19-.04-2.4-.3-3.48-.82-.47-.22-.91-.51-1.49-.81V15.9A6.6 6.6 0 1 1 13.1 10.07zM10 12.8a3.1 3.1 0 1 0 0 6.2 3.1 3.1 0 1 0 0-6.2z"
      />
    </svg>
  );
}
