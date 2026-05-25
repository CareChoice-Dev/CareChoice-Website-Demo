'use client'

import Image from 'next/image'
import { useState, useCallback, useEffect } from 'react'
import { Module } from '@/components/primitives/Module'
import type { SDAPhotoRef } from '@/app/api/sda-vacancies/mapper'

export interface SDAHeroGalleryProps {
  homeName: string
  photos: SDAPhotoRef[]
}

export function SDAHeroGallery({ homeName, photos }: SDAHeroGalleryProps) {
  const [index, setIndex] = useState(0)
  const count = photos.length
  const hero = photos[index]

  const prev = useCallback(() => setIndex((i) => (i - 1 + count) % count), [count])
  const next = useCallback(() => setIndex((i) => (i + 1) % count), [count])

  useEffect(() => {
    if (count <= 1) return
    const handler = (e: KeyboardEvent) => {
      if (e.key === 'ArrowLeft') prev()
      else if (e.key === 'ArrowRight') next()
    }
    window.addEventListener('keydown', handler)
    return () => window.removeEventListener('keydown', handler)
  }, [count, prev, next])

  return (
    <Module weight="default" className="overflow-hidden">
      <div className="relative aspect-[16/9] bg-cc-magenta-60 flex items-center justify-center">
        {hero ? (
          <>
            <Image
              key={hero.url}
              src={hero.url}
              alt={hero.alt || `Photo of ${homeName}`}
              fill
              sizes="(min-width: 1024px) 1280px, 100vw"
              className="object-cover"
              priority
            />
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={prev}
                  aria-label="Previous photo"
                  className="group absolute left-4 top-1/2 -translate-y-1/2 size-12 md:size-14 grid place-items-center bg-cc-black hover:bg-cc-magenta text-cc-white border-2 border-cc-black shadow-hard-btn transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cc-magenta"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-6 md:size-7" aria-hidden="true">
                    <polyline points="15 18 9 12 15 6" />
                  </svg>
                </button>
                <button
                  type="button"
                  onClick={next}
                  aria-label="Next photo"
                  className="group absolute right-4 top-1/2 -translate-y-1/2 size-12 md:size-14 grid place-items-center bg-cc-black hover:bg-cc-magenta text-cc-white border-2 border-cc-black shadow-hard-btn transition-colors focus:outline-none focus-visible:ring-4 focus-visible:ring-cc-magenta"
                >
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth={3} strokeLinecap="round" strokeLinejoin="round" className="size-6 md:size-7" aria-hidden="true">
                    <polyline points="9 18 15 12 9 6" />
                  </svg>
                </button>
                <div className="absolute right-4 bottom-4 px-3 py-1.5 bg-cc-black text-cc-white text-sm font-semibold tabular-nums border-2 border-cc-black shadow-hard-btn">
                  {index + 1} / {count}
                </div>
              </>
            )}
          </>
        ) : (
          <div className="flex flex-col gap-2 items-center text-cc-black">
            <span className="eyebrow">Photo coming soon.</span>
            <span className="text-sm">
              Photography for {homeName} is being added by the team.
            </span>
          </div>
        )}
      </div>

      {count > 1 && (
        <div className="flex gap-2 overflow-x-auto p-2 bg-cc-white border-t-2 border-cc-black scroll-smooth">
          {photos.map((p, i) => (
            <button
              key={p.url}
              type="button"
              onClick={() => setIndex(i)}
              aria-label={`Show photo ${i + 1} of ${count}`}
              aria-current={i === index}
              className={`relative shrink-0 w-24 aspect-[16/9] border-2 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-cc-magenta ${
                i === index ? 'border-cc-magenta' : 'border-cc-black/20 hover:border-cc-black'
              }`}
            >
              <Image src={p.url} alt="" fill sizes="96px" className="object-cover" />
            </button>
          ))}
        </div>
      )}
    </Module>
  )
}
