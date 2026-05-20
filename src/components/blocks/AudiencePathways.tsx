import {
  Users,
  Briefcase,
  HeartHandshake,
  type LucideIcon,
} from 'lucide-react'
import { Link } from '@/components/primitives/Link'
import { Module } from '@/components/primitives/Module'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { PayloadLocale } from '@/lib/locale'

const ICON_MAP: Record<string, LucideIcon> = {
  users: Users,
  briefcase: Briefcase,
  'heart-handshake': HeartHandshake,
}

interface PathwayRecord {
  id: number | string
  label: string
  description?: string
  targetUrl: string
  icon?: string
  sortOrder?: number
}

export async function AudiencePathways({ locale }: { locale: PayloadLocale }) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'audience-pathways',
    locale,
    fallbackLocale: 'en',
    sort: 'sortOrder',
    limit: 5,
  })
  const pathways = result.docs as unknown as PathwayRecord[]

  if (pathways.length === 0) return null

  return (
    <nav aria-label="Find your starting point" className="grid grid-cols-1 md:grid-cols-3 gap-0">
      {pathways.map((p) => {
        const Icon = p.icon ? ICON_MAP[p.icon] ?? Users : Users
        return (
          <Link key={String(p.id)} href={p.targetUrl} className="no-underline group">
            <Module
              weight="card"
              className="h-full p-6 flex flex-col gap-3 transition-transform duration-[0.18s] ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-hard-card motion-reduce:transition-none"
            >
              <Icon className="w-10 h-10" strokeWidth={1.75} aria-hidden="true" />
              <h3 className="text-2xl font-bold leading-tight">{p.label}.</h3>
              {p.description && <p className="text-base leading-relaxed">{p.description}</p>}
              <span className="mt-auto pt-2 font-semibold underline">Start here ▸</span>
            </Module>
          </Link>
        )
      })}
    </nav>
  )
}
