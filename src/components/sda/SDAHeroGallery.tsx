import Image from 'next/image'
import { Module } from '@/components/primitives/Module'

export interface SDAHeroGalleryProps {
  homeName: string
  imageUrl?: string | null
  imageAlt?: string
}

export function SDAHeroGallery({ homeName, imageUrl, imageAlt }: SDAHeroGalleryProps) {
  return (
    <Module weight="default" className="overflow-hidden">
      <div className="relative aspect-[16/9] bg-cc-magenta-60 flex items-center justify-center">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? `Photo of ${homeName}`}
            fill
            sizes="(min-width: 1024px) 1280px, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex flex-col gap-2 items-center text-cc-black">
            <span className="eyebrow">Photo coming soon.</span>
            <span className="text-sm">
              Photography intake for {homeName} happens in Week 3-4 of the build.
            </span>
          </div>
        )}
      </div>
    </Module>
  )
}
