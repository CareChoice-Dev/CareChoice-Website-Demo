import Image from 'next/image'
import NextLink from 'next/link'
import { Module } from '@/components/primitives/Module'
import { Tag } from '@/components/primitives/Tag'
import type { SDAVacancy } from './types'

export function SDAHomeCard({ home, hrefPrefix }: { home: SDAVacancy; hrefPrefix: string }) {
  const availableLabel =
    home.availableBeds === 0
      ? 'Currently full'
      : `${home.availableBeds} bed${home.availableBeds === 1 ? '' : 's'} available`

  return (
    <NextLink href={`${hrefPrefix}/find-a-home/${home.id}`} className="block no-underline group">
      <Module
        weight="card"
        className="overflow-hidden flex flex-col gap-4 h-full transition-transform duration-[0.18s] ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-hard-card motion-reduce:transition-none"
      >
        <div className="relative aspect-[4/3] bg-cc-surface-pink border-b-[7px] border-cc-black flex items-center justify-center">
          {home.photos[0] ? (
            <Image
              src={home.photos[0].url}
              alt={home.photos[0].alt || `Photo of ${home.name}`}
              fill
              sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
              className="object-cover"
            />
          ) : (
            <span className="eyebrow text-cc-fg-muted">Photo TBA</span>
          )}
        </div>
        <div className="px-5 pb-5 flex flex-col gap-2">
          <h3 className="text-xl font-bold leading-tight">{home.name}</h3>
          {home.address.formatted && (
            <p className="text-sm text-cc-fg-muted">{home.address.formatted}</p>
          )}
          <p className="text-sm font-semibold">{availableLabel}.</p>
          <div className="flex flex-wrap gap-2 pt-1">
            {home.designStandard && <Tag>{home.designStandard}</Tag>}
            {home.propertyType && <Tag variant="outline">{home.propertyType}</Tag>}
          </div>
        </div>
      </Module>
    </NextLink>
  )
}
