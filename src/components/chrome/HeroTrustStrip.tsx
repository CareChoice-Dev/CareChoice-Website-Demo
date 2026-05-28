import Image from 'next/image'

/**
 * Slim trust band that sits directly under the hero — the same accreditations
 * shown larger in the footer (TrustMarks.tsx), but compressed into a single
 * horizontal strip for instant credibility above the fold.
 */

const STRIP_MARKS = [
  { src: '/brand/trust-marks/ndis-registered.jpg', alt: 'NDIS Registered Service Provider' },
  { src: '/brand/trust-marks/ndis-mark-of-trust.png', alt: 'NDIS Mark of Trust certified provider' },
  { src: '/brand/trust-marks/nds-associate.jpg', alt: 'National Disability Services (NDS) Associate' },
  { src: '/brand/trust-marks/vic-government.png', alt: 'Victorian Government supported provider' },
  { src: '/brand/trust-marks/tac-worksafe.svg', alt: 'TAC and WorkSafe registered provider' },
] as const

export function HeroTrustStrip() {
  return (
    <section
      aria-labelledby="trust-strip-heading"
      className="border-y-2 border-cc-black bg-cc-white"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-4 flex flex-col md:flex-row items-start md:items-center gap-3 md:gap-6">
        <p id="trust-strip-heading" className="eyebrow shrink-0">
          Registered. Accredited. Trusted.
        </p>
        <ul className="flex flex-wrap items-center gap-3 md:gap-4 list-none p-0 m-0">
          {STRIP_MARKS.map((mark) => (
            <li
              key={mark.src}
              className="flex items-center justify-center h-12 px-2 grayscale opacity-80 hover:grayscale-0 hover:opacity-100 transition motion-reduce:transition-none"
            >
              <Image
                src={mark.src}
                alt={mark.alt}
                width={120}
                height={48}
                className="h-full w-auto object-contain"
              />
            </li>
          ))}
        </ul>
      </div>
    </section>
  )
}
