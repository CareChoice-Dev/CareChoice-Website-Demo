import Image from 'next/image'

interface Flag {
  src: string
  alt: string
}

const FLAGS: Flag[] = [
  { src: '/brand/inclusion/flag-aboriginal.png', alt: 'Aboriginal flag' },
  { src: '/brand/inclusion/flag-torres-strait.png', alt: 'Torres Strait Islander flag' },
  { src: '/brand/inclusion/flag-pride.png', alt: 'Progress Pride flag' },
]

export function InclusionFlags() {
  return (
    <section
      aria-labelledby="inclusion-flags-heading"
      className="border-t-2 border-cc-black pt-4 flex flex-wrap items-center gap-4"
    >
      <ul className="flex items-center gap-3 list-none p-0 m-0">
        {FLAGS.map((flag) => (
          <li key={flag.src} className="flex items-center">
            <Image
              src={flag.src}
              alt={flag.alt}
              width={60}
              height={40}
              className="h-8 sm:h-10 w-auto object-contain"
            />
          </li>
        ))}
      </ul>
      <p id="inclusion-flags-heading" className="text-sm font-semibold max-w-xl">
        We acknowledge and welcome people of all backgrounds, identities, and abilities.
      </p>
    </section>
  )
}
