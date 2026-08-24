import { PhoneCall } from 'lucide-react';
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { FREE_SHIPPING_MXN } from '../../context/quote-store';
import { cn } from '../../lib/cn';
import { formatPrice } from '../../lib/format';

const ROTATION_MS = 5500;

const messages = [
  `Envío sin costo en pedidos mayoristas desde ${formatPrice(FREE_SHIPPING_MXN)}`,
  'Pedidos confirmados antes de las 14:00 salen el mismo día',
  '6 marcas importadas en exclusiva para México',
];

export function AnnouncementBar() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const query = window.matchMedia('(prefers-reduced-motion: reduce)');
    if (query.matches) return;

    const timer = window.setInterval(() => {
      setIndex((current) => (current + 1) % messages.length);
    }, ROTATION_MS);
    return () => window.clearInterval(timer);
  }, []);

  return (
    <div className="bg-ink-950 border-b border-white/10">
      <div className="shell flex h-10 items-center justify-between gap-6">
        <a
          href="tel:+525543218800"
          className="text-gold-200 hover:text-gold-100 inline-flex items-center gap-2 text-xs font-medium tracking-[0.01em] transition-colors"
        >
          <PhoneCall className="h-3.5 w-3.5" aria-hidden="true" />
          <span className="tabular-nums">+52 55 4321 8800</span>
        </a>

        <p
          aria-live="off"
          className="relative hidden h-10 flex-1 items-center justify-center md:flex"
        >
          {messages.map((message, messageIndex) => {
            const active = messageIndex === index;
            return (
              <span
                key={message}
                aria-hidden={active ? undefined : 'true'}
                className={cn(
                  'text-ink-200 absolute inset-0 flex items-center justify-center text-center text-xs transition-opacity duration-700 ease-[var(--ease-out-quint)]',
                  active ? 'opacity-100' : 'opacity-0',
                )}
              >
                {message}
              </span>
            );
          })}
        </p>

        <nav aria-label="Accesos rápidos" className="hidden items-center gap-6 lg:flex">
          <Link
            to="/contacto"
            className="text-gold-200 hover:text-gold-100 text-xs font-medium transition-colors"
          >
            Sucursales
          </Link>
          <Link
            to="/mayoristas"
            className="text-gold-200 hover:text-gold-100 text-xs font-medium transition-colors"
          >
            Programa mayorista
          </Link>
        </nav>
      </div>
    </div>
  );
}
