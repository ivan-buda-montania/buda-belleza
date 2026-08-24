import { CountUp } from '../components/ui/CountUp';
import { Reveal } from '../components/ui/Reveal';
import { stats } from '../data/institutional';
import { cn } from '../lib/cn';

export function TrustBar() {
  return (
    <div className="shell relative z-10 -mt-10 sm:-mt-14">
      <section
        aria-label="Buda Belleza en cifras"
        className="rounded-panel-lg bg-surface ring-ink-900/[0.05] px-6 py-7 shadow-[var(--shadow-e3)] ring-1 sm:px-10 sm:py-9"
      >
        <div className="grid grid-cols-2 sm:grid-cols-4">
          {stats.map((stat, index) => (
            <Reveal
              key={stat.id}
              delay={index * 80}
              y={14}
              className={cn(
                'border-line flex flex-col items-center px-2 text-center sm:px-6',
                index % 2 === 1 && 'border-l',
                index === 2 && 'sm:border-l',
                index < 2 ? 'pb-6 sm:pb-0' : 'pt-6 sm:pt-0',
                index < 2 && 'border-b sm:border-b-0',
              )}
            >
              <span aria-hidden="true" className="bg-gold-400 mb-3.5 block h-px w-7" />
              <p className="font-display text-display-md text-ink-900 font-medium tabular-nums">
                {stat.prefix}
                <CountUp value={stat.value} />
                {stat.suffix}
              </p>
              <p className="text-ink-800 mt-2 text-sm font-semibold">{stat.label}</p>
              <p className="text-ink-500 mt-1 text-xs leading-relaxed text-balance">
                {stat.detail}
              </p>
            </Reveal>
          ))}
        </div>
      </section>
    </div>
  );
}
