import { Suspense } from 'react';
import { Outlet } from 'react-router-dom';
import { categories } from '../../data/categories';
import { socialLinks } from '../../data/social-links';
import { QuoteDrawer } from '../quote/QuoteDrawer';
import { AnnouncementBar } from './AnnouncementBar';
import { FloatingActions } from './FloatingActions';
import { Footer } from './Footer';
import { Navbar } from './Navbar';
import { RouteFallback } from './RouteFallback';
import { ScrollToTop } from './ScrollToTop';

export function Layout() {
  return (
    <div className="bg-canvas flex min-h-screen flex-col">
      <a
        href="#contenido"
        className="focus:bg-brand-600 sr-only focus:not-sr-only focus:fixed focus:top-4 focus:left-4 focus:z-100 focus:inline-flex focus:h-11 focus:items-center focus:rounded-full focus:px-5 focus:text-sm focus:font-semibold focus:text-white focus:shadow-[var(--shadow-e3)]"
      >
        Saltar al contenido
      </a>

      <ScrollToTop />
      <AnnouncementBar />
      <Navbar />

      <main id="contenido" className="flex-1">
        <Suspense fallback={<RouteFallback />}>
          <Outlet />
        </Suspense>
      </main>

      <Footer categories={categories} socialLinks={socialLinks} />
      <QuoteDrawer />
      <FloatingActions />
    </div>
  );
}
