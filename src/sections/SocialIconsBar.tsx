import { socialIconMap } from '../components/icons/socialIconMap';
import { Eyebrow } from '../components/ui/Eyebrow';
import { Reveal } from '../components/ui/Reveal';
import { Section } from '../components/ui/Section';
import { cn } from '../lib/cn';
import type { SocialLink, SocialPlatform } from '../types/social';

interface SocialIconsBarProps {
  socialLinks: SocialLink[];
  size?: 'lg' | 'sm';
  title?: string;
}

const linkAction: Record<SocialPlatform, string> = {
  whatsapp: 'Escríbenos por WhatsApp',
  facebook: 'Síguenos en Facebook',
  instagram: 'Síguenos en Instagram',
  tiktok: 'Síguenos en TikTok',
};

export function SocialIconsBar({ socialLinks, size = 'lg', title }: SocialIconsBarProps) {
  if (size === 'sm') {
    return (
      <ul className="flex flex-wrap items-center gap-2.5">
        {socialLinks.map((link) => {
          const Icon = socialIconMap[link.id];

          // 40px mark, but the pseudo-element pushes the hit area back up to 44px.
          return (
            <li key={link.id}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={linkAction[link.id]}
                className="hover:bg-brand-600 text-ink-200 relative flex h-10 w-10 items-center justify-center rounded-full border border-white/15 transition-[background-color,color,border-color,transform,translate,scale,rotate] duration-250 ease-[var(--ease-out-quint)] after:absolute after:-inset-0.5 after:content-[''] hover:-translate-y-0.5 hover:border-transparent hover:text-white"
              >
                <Icon className="h-4.5 w-4.5" />
              </a>
            </li>
          );
        })}
      </ul>
    );
  }

  return (
    <Section tone="sunken" padding="md" aria-labelledby="social-title">
      <Reveal className="flex flex-col items-center gap-3.5 text-center">
        <Eyebrow>Comunidad</Eyebrow>
        <h2 id="social-title" className="font-display text-display-md text-ink-900 font-medium">
          {title ?? 'Síguenos y aprende con nosotros'}
        </h2>
        <p className="text-ink-600 max-w-2xl text-sm sm:text-base">
          Tutoriales de aplicación, lanzamientos antes que en piso de venta y las ofertas de volumen
          de cada quincena.
        </p>
      </Reveal>

      <ul className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
        {socialLinks.map((link, index) => {
          const Icon = socialIconMap[link.id];
          const priority = link.id === 'whatsapp';

          return (
            <Reveal as="li" key={link.id} delay={index * 80} y={16}>
              <a
                href={link.href}
                target="_blank"
                rel="noreferrer noopener"
                aria-label={`${linkAction[link.id]}, ${link.handle}`}
                className={cn(
                  'group bg-surface rounded-panel flex h-full items-center gap-4 px-6 py-5 shadow-[var(--shadow-e1)] ring-1 transition-[transform,translate,scale,rotate,box-shadow] duration-300 ease-[var(--ease-out-quint)] hover:-translate-y-1 hover:shadow-[var(--shadow-e2)]',
                  priority ? 'ring-gold-300' : 'ring-ink-900/[0.05]',
                )}
              >
                <span
                  aria-hidden="true"
                  className="bg-brand-50 text-brand-600 group-hover:bg-brand-600 flex h-12 w-12 shrink-0 items-center justify-center rounded-full transition-colors duration-300 ease-[var(--ease-out-quint)] group-hover:text-white"
                >
                  <Icon className="h-5 w-5" />
                </span>
                <span className="flex min-w-0 flex-col gap-0.5">
                  <span className="flex flex-wrap items-center gap-x-2 gap-y-1">
                    <span className="text-ink-900 font-semibold">{link.label}</span>
                    {priority && <span className="eyebrow text-gold-600">Atención inmediata</span>}
                  </span>
                  <span className="text-ink-500 truncate text-sm">{link.handle}</span>
                </span>
              </a>
            </Reveal>
          );
        })}
      </ul>
    </Section>
  );
}
