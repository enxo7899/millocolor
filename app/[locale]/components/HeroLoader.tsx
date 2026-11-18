/**
 * Hero loading state. Deliberately free of three.js so it renders with the page itself,
 * before the 3D code has downloaded.
 *
 * It shows the MILLOCOLOR sign unpainted (primer grey), in the same place the 3D sign will appear,
 * with a thin progress line. When the scene is ready it fades out over the live sign.
 */

export const HERO_SECTION_CLASS =
  'relative w-full overflow-hidden bg-[#050608] h-[clamp(470px,62svh,600px)] sm:h-[min(90svh,880px)] sm:min-h-[560px]';

const WORDMARK = '/models/millocolor-wordmark.svg';

export default function HeroLoader({ progress, visible = true }: { progress?: number; visible?: boolean }) {
  const known = typeof progress === 'number';
  const pct = known ? Math.max(4, Math.min(100, progress)) : 0;
  return (
    <div
      aria-hidden={!visible}
      role={visible ? 'status' : undefined}
      aria-label={visible ? 'Loading' : undefined}
      className="absolute inset-0 z-[4] transition-opacity duration-700 ease-out"
      style={{ opacity: visible ? 1 : 0, pointerEvents: 'none', background: 'radial-gradient(ellipse 70% 55% at 50% 38%, #15171c 0%, #050608 70%)' }}
    >
      <div className="hero-loader-mark">
        <div className="relative w-full" style={{ aspectRatio: '2710 / 360' }}>
          {/* unpainted sign */}
          <div
            className="absolute inset-0"
            style={{
              background: '#646871',
              WebkitMaskImage: `url(${WORDMARK})`, maskImage: `url(${WORDMARK})`,
              WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
            }}
          />
          {/* a soft highlight passes over it while loading */}
          <div
            className="absolute inset-0 hero-loader-sheen"
            style={{
              WebkitMaskImage: `url(${WORDMARK})`, maskImage: `url(${WORDMARK})`,
              WebkitMaskSize: '100% 100%', maskSize: '100% 100%',
              WebkitMaskRepeat: 'no-repeat', maskRepeat: 'no-repeat',
            }}
          />
        </div>
        <div className="absolute left-1/2 top-[calc(100%+clamp(28px,5vw,56px))] h-px w-[clamp(120px,18vw,220px)] -translate-x-1/2 overflow-hidden bg-white/12">
          {known ? (
            <div className="h-full bg-white/70 transition-[width] duration-300 ease-out" style={{ width: `${pct}%` }} />
          ) : (
            <div className="hero-loader-indeterminate h-full w-1/3 bg-white/60" />
          )}
        </div>
      </div>
      <style>{`
        /* Matches where the 3D sign's front face lands (measured per aspect ratio), so the hand-off is seamless.
           The SVG box is 2.1% wider than the letters and their centre sits 2.6% below the box centre. */
        .hero-loader-mark { position: absolute; left: 50%; --w: 93.9%; --cy: 42%;
          width: calc(var(--w) / 0.979); top: var(--cy); transform: translate(-50%, -52.6%); }
        @media (min-aspect-ratio: 16/9) { .hero-loader-mark { --w: 95%; --cy: 40.3%; } }
        @media (max-aspect-ratio: 4/3) { .hero-loader-mark { --w: 93.1%; --cy: 43.3%; } }
        @media (max-aspect-ratio: 1/1) { .hero-loader-mark { --w: 96.5%; --cy: 45.5%; } }
        @media (max-aspect-ratio: 3/5) { .hero-loader-mark { --w: 95.7%; --cy: 47%; } }
        /* phones (shorter hero below the sm breakpoint) */
        @media (max-width: 639px) { .hero-loader-mark { --w: 96%; --cy: 46.35%; } }
        .hero-loader-sheen {
          background: linear-gradient(100deg, transparent 0%, transparent 40%, rgba(255,255,255,0.22) 50%, transparent 60%, transparent 100%);
          background-size: 250% 100%;
          animation: heroSheen 2.2s ease-in-out infinite;
        }
        .hero-loader-indeterminate { animation: heroIndet 1.3s ease-in-out infinite; }
        @keyframes heroSheen { 0% { background-position: 120% 0; } 100% { background-position: -20% 0; } }
        @keyframes heroIndet { 0% { transform: translateX(-100%); } 100% { transform: translateX(300%); } }
        @media (prefers-reduced-motion: reduce) {
          .hero-loader-sheen, .hero-loader-indeterminate { animation: none; }
        }
      `}</style>
    </div>
  );
}
