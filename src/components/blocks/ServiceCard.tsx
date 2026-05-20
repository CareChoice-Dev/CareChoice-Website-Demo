import { Link } from '@/components/primitives/Link'
import { Module } from '@/components/primitives/Module'
import { Tag } from '@/components/primitives/Tag'

export interface ServiceCardProps {
  title: string
  href: string
  intro?: string
  category?: string
  fundingTypes?: string[]
}

export async function ServiceCard({ title, href, intro, category, fundingTypes }: ServiceCardProps) {
  return (
    <Link href={href} className="block no-underline group">
      <Module
        weight="card"
        className="p-6 h-full flex flex-col gap-3 transition-transform duration-[0.18s] ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-hard-card motion-reduce:transition-none"
      >
        {category && <span className="eyebrow">{category}</span>}
        <h3 className="text-2xl font-bold leading-tight">{title}</h3>
        {intro && <p className="text-base leading-relaxed">{intro}</p>}
        {fundingTypes && fundingTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 mt-auto pt-3">
            {fundingTypes.map((f) => (
              <Tag key={f} variant="outline">
                {f}
              </Tag>
            ))}
          </div>
        )}
      </Module>
    </Link>
  )
}
