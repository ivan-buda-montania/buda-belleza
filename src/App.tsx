import { lazy } from 'react';
import { Route, Routes } from 'react-router-dom';
import { Layout } from './components/layout/Layout';
import { HomePage } from './pages/HomePage';

// The landing page ships in the initial bundle; every other route loads on demand.
const CatalogPage = lazy(() =>
  import('./pages/CatalogPage').then((m) => ({ default: m.CatalogPage })),
);
const CategoryPage = lazy(() =>
  import('./pages/CategoryPage').then((m) => ({ default: m.CategoryPage })),
);
const ClientsPage = lazy(() =>
  import('./pages/ClientsPage').then((m) => ({ default: m.ClientsPage })),
);
const BrandsPage = lazy(() =>
  import('./pages/BrandsPage').then((m) => ({ default: m.BrandsPage })),
);
const ContactPage = lazy(() =>
  import('./pages/ContactPage').then((m) => ({ default: m.ContactPage })),
);
const LegalPage = lazy(() => import('./pages/LegalPage').then((m) => ({ default: m.LegalPage })));
const NotFoundPage = lazy(() =>
  import('./pages/NotFoundPage').then((m) => ({ default: m.NotFoundPage })),
);

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<HomePage />} />
        <Route path="catalogo" element={<CatalogPage />} />
        <Route path="categoria/:slug" element={<CategoryPage />} />
        <Route path="mayoristas" element={<ClientsPage />} />
        <Route path="marcas" element={<BrandsPage />} />
        <Route path="contacto" element={<ContactPage />} />
        <Route path="aviso-de-privacidad" element={<LegalPage />} />
        <Route path="terminos-de-venta" element={<LegalPage />} />
        <Route path="politica-de-envios" element={<LegalPage />} />
        <Route path="*" element={<NotFoundPage />} />
      </Route>
    </Routes>
  );
}

export default App;
