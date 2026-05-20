import Image from 'next/image'
import { Module } from '@/components/primitives/Module'

export interface CaseStudyHeroProps {
  title: string
  participantName?: string
  imageUrl?: string | null
  imageAlt?: string
}

export function CaseStudyHero({ title, participantName, imageUrl, imageAlt }: CaseStudyHeroProps) {
  return (
    <Module weight="default" className="overflow-hidden">
      <div className="relative aspect-[16/9] bg-cc-magenta-60 flex items-end p-6 md:p-10">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={imageAlt ?? title}
            fill
            sizes="(min-width: 1024px) 1280px, 100vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="absolute inset-0 flex items-center justify-center">
            <span className="eyebrow">Photo coming soon.</span>
          </div>
        )}

        <div className="relative z-10 max-w-3xl bg-cc-black/80 text-white p-4 md:p-6">
          {participantName && (
            <span className="eyebrow opacity-90">{participantName}&apos;s story.</span>
          )}
          <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight mt-1">{title}</h1>
        </div>
      </div>
    </Module>
  )
}
