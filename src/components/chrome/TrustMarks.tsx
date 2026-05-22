import Image from 'next/image'

interface TrustMark {
  src: string
  alt: string
  width: number
  height: number
}

const TRUST_MARKS: TrustMark[] = [
  {
    src: '/brand/trust-marks/ndis-registered.jpg',
    alt: 'NDIS Registered Service Provider',
    width: 200,
    height: 96,
  },
  {
    src: '/brand/trust-marks/ndis-mark-of-trust.png',
    alt: 'NDIS Mark of Trust certified provider',
    width: 200,
    height: 96,
  },
  {
    src: '/brand/trust-marks/nds-associate.jpg',
    alt: 'National Disability Services (NDS) Associate',
    width: 200,
    height: 96,
  },
  {
    src: '/brand/trust-marks/ndisda.png',
    alt: 'NDISDA partner',
    width: 200,
    height: 96,
  },
  {
    src: '/brand/trust-marks/vic-government.png',
    alt: 'Victorian Government supported provider',
    width: 200,
    height: 96,
  },
  {
    src: '/brand/trust-marks/aafd.png',
    alt: 'Australasian Association of Forensic Disability member',
    width: 200,
    height: 96,
  },
  {
    src: '/brand/trust-marks/tac-worksafe.svg',
    alt: 'TAC and WorkSafe registered provider',
    width: 200,
    height: 96,
  },
]

export function TrustMarks() {
  return (
    <section
      aria-labelledby="trust-marks-heading"
      className="border-t-2 border-cc-black pt-6"
    >
      <p id="trust-marks-heading" className="eyebrow mb-4">
        Registered. Accredited. Trusted.
      </p>
      <ul className="flex flex-wrap gap-3 sm:gap-4 list-none p-0 m-0">
        {TRUST_MARKS.map((mark) => (
          <li
            key={mark.src}
            className="bg-cc-white border-2 border-cc-black p-3 flex items-center justify-center h-16 sm:h-[72px] w-[calc(50%-0.375rem)] sm:w-[calc(33.333%-0.667rem)] md:w-auto md:min-w-[140px]"
          >
            <Image
              src={mark.src}
              alt={mark.alt}
              width={mark.width}
              height={mark.height}
              className="h-full w-auto object-contain"
            />
          </li>
        ))}
      </ul>
    </section>
  )
}
