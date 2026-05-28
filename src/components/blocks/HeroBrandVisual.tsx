/**
 * HeroBrandVisual — a decorative, on-brand poster that fills the homepage
 * hero's right column and ties the composition to the H1
 * ("home, support, and team").
 *
 * Pure CareChoice design language: flat colours (no gradients), sharp corners,
 * heavy black borders, hard offset shadows, and the magenta "C" arc from the
 * logo as a unifying graphic. Three staggered tiles spell out the headline's
 * three pillars.
 *
 * `aria-hidden` — it is purely decorative and duplicates the H1's meaning, so
 * it's hidden from assistive tech. Hidden below `lg` because the empty space it
 * fills only exists in the two-column desktop hero. The staggered reveal is
 * disabled automatically by the global reduced-motion rules.
 */

const PILLARS = [
  {
    word: 'Home.',
    delay: '0ms',
    offset: 'lg:ml-0',
    tile: 'bg-cc-white text-cc-black',
    iconWrap: 'bg-cc-magenta text-cc-white border-cc-black',
    icon: (
      <>
        <path d="M3 11.5 12 4l9 7.5" />
        <path d="M5.5 10v9.5h13V10" />
        <path d="M10 19.5v-5h4v5" />
      </>
    ),
  },
  {
    word: 'Support.',
    delay: '120ms',
    offset: 'lg:ml-16',
    tile: 'bg-cc-magenta text-cc-white',
    iconWrap: 'bg-cc-white text-cc-magenta border-cc-black',
    icon: <path d="M12 20.5S3.5 15 3.5 8.8A4.3 4.3 0 0 1 12 7a4.3 4.3 0 0 1 8.5 1.8C20.5 15 12 20.5 12 20.5Z" />,
  },
  {
    word: 'Team.',
    delay: '240ms',
    offset: 'lg:ml-6',
    tile: 'bg-cc-black text-cc-white',
    iconWrap: 'bg-cc-magenta text-cc-white border-cc-white',
    icon: (
      <>
        <circle cx="8" cy="9" r="3" />
        <circle cx="16" cy="9" r="3" />
        <path d="M3.5 19.5c0-3 2-4.5 4.5-4.5s4.5 1.5 4.5 4.5" />
        <path d="M13 15.2c.9-.5 1.9-.7 3-.7 2.5 0 4.5 1.5 4.5 4.5" />
      </>
    ),
  },
] as const

export function HeroBrandVisual() {
  return (
    <div
      aria-hidden="true"
      className="relative hidden lg:block mt-6 min-h-[340px] select-none"
    >
      {/* Magenta "C" arc — the logo motif, swept behind the tiles. */}
      <svg
        viewBox="0 0 200 200"
        className="absolute -top-4 right-0 w-[300px] h-[300px] z-0"
        fill="none"
        stroke="var(--cc-magenta)"
        strokeWidth="16"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <path className="cc-arc-draw" d="M155 45 A78 78 0 1 0 155 155" />
        <circle cx="150" cy="100" r="11" fill="var(--cc-magenta)" stroke="none" />
      </svg>

      {/* Brand dot-grid accent, bottom-left, behind tiles. */}
      <div
        className="absolute bottom-2 left-0 z-0 grid grid-cols-5 gap-2"
        aria-hidden="true"
      >
        {Array.from({ length: 15 }).map((_, i) => (
          <span key={i} className="block w-2 h-2 bg-cc-magenta-60" />
        ))}
      </div>

      {/* Three staggered pillar tiles. */}
      <div className="relative z-10 flex flex-col gap-4 pt-4">
        {PILLARS.map((p) => (
          <div
            key={p.word}
            className={`cc-rise ${p.offset} ${p.tile} w-[240px] flex items-center gap-4 border-[3px] border-cc-black px-5 py-4 shadow-[6px_6px_0_#000]`}
            style={{ animationDelay: p.delay }}
          >
            <span
              className={`${p.iconWrap} grid place-items-center w-11 h-11 border-2 shrink-0`}
            >
              <svg
                viewBox="0 0 24 24"
                className="w-6 h-6"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.4"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {p.icon}
              </svg>
            </span>
            <span className="text-2xl font-bold tracking-tight leading-none">{p.word}</span>
          </div>
        ))}
      </div>

      {/* Tagline stamp. */}
      <span
        className="cc-rise absolute bottom-0 right-0 z-10 eyebrow bg-cc-black text-cc-white px-3 py-1.5"
        style={{ animationDelay: '360ms' }}
      >
        Taking care further.
      </span>
    </div>
  )
}
