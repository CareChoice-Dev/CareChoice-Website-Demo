import Image from 'next/image'
import NextLink from 'next/link'
import { headers } from 'next/headers'
import { Module } from '@/components/primitives/Module'
import { Tag } from '@/components/primitives/Tag'
import type { SDAVacancy } from '@/components/sda/types'

async function fetchTopVacancies(limit = 4): Promise<SDAVacancy[]> {
  const h = await headers()
  const proto = h.get('x-forwarded-proto') ?? 'http'
  const host = h.get('host') ?? 'localhost:3000'
  const res = await fetch(`${proto}://${host}/api/sda-vacancies`, {
    next: { revalidate: 600 },
  })
  if (!res.ok) return []
  const data: { vacancies: SDAVacancy[] } = await res.json()
  // Prioritise homes with at least one available bed
  const available = data.vacancies.filter((v) => v.availableBeds > 0)
  const rest = data.vacancies.filter((v) => v.availableBeds === 0)
  return [...available, ...rest].slice(0, limit)
}

export async function SDAPreviewRow({ hrefPrefix }: { hrefPrefix: string }) {
  const homes = await fetchTopVacancies(4)
  if (homes.length === 0) return null

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
      {homes.map((h) => (
        <NextLink
          key={h.id}
          href={`${hrefPrefix}/find-a-home/${h.id}`}
          className="block no-underline group"
        >
          <Module
            weight="card"
            className="overflow-hidden h-full flex flex-col transition-transform duration-[0.18s] ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-hard-card motion-reduce:transition-none"
          >
            <div className="relative aspect-[4/3] bg-cc-surface-pink border-b-[7px] border-cc-black flex items-center justify-center">
              {h.photos[0] ? (
                <Image
                  src={h.photos[0].url}
                  alt={h.photos[0].alt || `Photo of ${h.name}`}
                  fill
                  sizes="(min-width: 1024px) 33vw, (min-width: 768px) 50vw, 100vw"
                  className="object-cover"
                />
              ) : (
                <span className="eyebrow text-cc-fg-muted">Photo TBA</span>
              )}
            </div>
            <div className="p-4 flex flex-col gap-2">
              <h4 className="text-lg font-bold leading-tight">{h.name}</h4>
              {h.address.suburb && (
                <p className="text-sm text-cc-fg-muted">{h.address.suburb}</p>
              )}
              <p className="text-sm font-semibold">
                {h.availableBeds > 0
                  ? `${h.availableBeds} bed${h.availableBeds === 1 ? '' : 's'} available.`
                  : 'Currently full.'}
              </p>
              {h.designStandard && (
                <div className="pt-1">
                  <Tag variant="outline">{h.designStandard}</Tag>
                </div>
              )}
            </div>
          </Module>
        </NextLink>
      ))}
    </div>
  )
}
