import { Link } from '@/components/primitives/Link'
import { Module } from '@/components/primitives/Module'
import { Tag } from '@/components/primitives/Tag'

const CATEGORY_LABELS: Record<string, string> = {
  'disability-services': 'Disability Services',
  'complex-care': 'Complex Care',
  'specialist-services': 'Specialist Services',
  housing: 'Housing',
}

export interface ServiceCardProps {
  title: string
  href: string
  intro?: string
  category?: string
  fundingTypes?: string[]
}

export async function ServiceCard({ title, href, intro, category, fundingTypes }: ServiceCardProps) {
  const eyebrow = category ? CATEGORY_LABELS[category] ?? category : undefined

  return (
    <Link href={href} className="block no-underline group h-full">
      <Module
        weight="card"
        className="p-6 h-full flex flex-col gap-3 transition-transform duration-[0.18s] ease-out group-hover:-translate-x-[2px] group-hover:-translate-y-[2px] group-hover:shadow-hard-card motion-reduce:transition-none"
      >
        {eyebrow && <span className="eyebrow">{eyebrow}</span>}
        <h3 className="text-2xl font-bold leading-tight">{title}</h3>
        {intro && <p className="text-base leading-relaxed line-clamp-2">{intro}</p>}
        {fundingTypes && fundingTypes.length > 0 && (
          <div className="flex flex-wrap gap-2 pt-1">
            {fundingTypes.map((f) => (
              <Tag key={f} variant="outline">
                {f.toUpperCase()}
              </Tag>
            ))}
          </div>
        )}
        <span
          aria-hidden="true"
          className="mt-auto pt-3 font-semibold text-cc-magenta group-hover:underline"
        >
          Learn more →
        </span>
      </Module>
    </Link>
  )
}
