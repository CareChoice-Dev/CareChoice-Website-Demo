import Image from 'next/image'
import { Module } from '@/components/primitives/Module'
import type { SDAPhotoRef } from '@/app/api/sda-vacancies/mapper'

export interface SDAHeroGalleryProps {
  homeName: string
  photos: SDAPhotoRef[]
}

export function SDAHeroGallery({ homeName, photos }: SDAHeroGalleryProps) {
  const hero = photos[0]
  return (
    <Module weight="default" className="overflow-hidden">
      <div className="relative aspect-[16/9] bg-cc-magenta-60 flex items-center justify-center">
        {hero ? (
          <Image
            src={hero.url}
            alt={hero.alt || `Photo of ${homeName}`}
            fill
            sizes="(min-width: 1024px) 1280px, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="flex flex-col gap-2 items-center text-cc-black">
            <span className="eyebrow">Photo coming soon.</span>
            <span className="text-sm">
              Photography for {homeName} is being added by the team.
            </span>
          </div>
        )}
      </div>
    </Module>
  )
}
