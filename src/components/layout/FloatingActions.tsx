import { ArrowUp } from 'lucide-react';
import { useEffect, useState } from 'react';
import { WhatsAppIcon } from '../icons/SocialIcons';
import { cn } from '../../lib/cn';
import { buildWhatsappHref, whatsappMessages } from '../../lib/whatsapp';

const SHOW_TOP_AFTER = 600;

const whatsappHref = buildWhatsappHref(whatsappMessages.general);

const tooltipClass =
  'bg-ink-900 pointer-events-none absolute right-full mr-3 hidden translate-x-1 rounded-full px-3 py-1.5 text-xs font-medium whitespace-nowrap text-white opacity-0 shadow-[var(--shadow-e2)] transition-[opacity,transform,translate,scale,rotate] duration-250 ease-[var(--ease-out-quint)] group-hover:translate-x-0 group-hover:opacity-100 group-focus-visible:translate-x-0 group-focus-visible:opacity-100 sm:block';

export function FloatingActions() {
  const [showTop, setShowTop] = useState(false);

  useEffect(() => {
    const handleScroll = () => setShowTop(window.scrollY > SHOW_TOP_AFTER);
    handleScroll();
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  return (
    <div className="pointer-events-none fixed right-4 bottom-4 z-40 flex flex-col items-end gap-3 pr-[env(safe-area-inset-right)] pb-[env(safe-area-inset-bottom)] sm:right-6 sm:bottom-6">
      <button
        type="button"
        aria-label="Volver al inicio de la página"
        tabIndex={showTop ? 0 : -1}
        onClick={() => {
          window.scrollTo({ top: 0, behavior: 'smooth' });
          const main = document.getElementById('contenido');
          if (main) {
            main.setAttribute('tabindex', '-1');
            main.focus({ preventScroll: true });
          }
        }}
        className={cn(
          'group border-line bg-surface/90 text-ink-700 hover:text-ink-900 hover:border-ink-300 relative grid h-12 w-12 cursor-pointer place-items-center rounded-full border shadow-[var(--shadow-e2)] backdrop-blur-md transition-[opacity,transform,translate,scale,rotate,color,border-color] duration-300 ease-[var(--ease-out-quint)]',
          showTop
            ? 'pointer-events-auto translate-y-0 opacity-100'
            : 'pointer-events-none translate-y-3 opacity-0',
        )}
      >
        <span className={tooltipClass} aria-hidden="true">
          Volver arriba
        </span>
        <ArrowUp className="h-5 w-5" aria-hidden="true" />
      </button>

      <a
        href={whatsappHref}
        target="_blank"
        rel="noreferrer"
        aria-label="Escríbenos por WhatsApp"
        className="group bg-brand-600 hover:bg-brand-700 pointer-events-auto relative grid h-12 w-12 place-items-center rounded-full text-white shadow-[var(--shadow-brand)] transition-[background-color,transform,translate,scale,rotate] duration-250 ease-[var(--ease-out-quint)] hover:-translate-y-0.5"
      >
        <span className={tooltipClass} aria-hidden="true">
          Escríbenos por WhatsApp
        </span>
        <WhatsAppIcon className="h-6 w-6" aria-hidden="true" />
      </a>
    </div>
  );
}
