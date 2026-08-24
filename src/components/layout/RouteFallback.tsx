/** Placeholder shown while a lazily-loaded route chunk arrives. */
export function RouteFallback() {
  return (
    <div className="shell py-20" role="status" aria-live="polite">
      <span className="sr-only">Cargando…</span>
      <div className="bg-ink-100 h-3 w-28 animate-pulse rounded-full" />
      <div className="bg-ink-100 mt-6 h-10 w-full max-w-xl animate-pulse rounded-full" />
      <div className="bg-ink-100 mt-3 h-10 w-full max-w-md animate-pulse rounded-full" />
      <div className="mt-12 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4">
        {Array.from({ length: 4 }, (_, index) => (
          <div key={index} className="bg-ink-100 rounded-card aspect-[3/4] animate-pulse" />
        ))}
      </div>
    </div>
  );
}
