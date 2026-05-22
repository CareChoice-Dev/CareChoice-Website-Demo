import type { ReactNode } from 'react'
import { Tag } from '@/components/primitives/Tag'
import { cn } from '@/lib/cn'

export interface ServiceHeroProps {
  eyebrow?: string
  title: string
  intro?: ReactNode
  fundingTypes?: string[]
  className?: string
}

/**
 * Hero band for a service detail page. Mirrors the visual rhythm of the
 * polished static SIL page so every service page reads the same.
 *
 * Renders the eyebrow (category), the headline (with full stop preserved as
 * passed in by the caller), an optional intro paragraph, and the funding
 * tags as outline chips below.
 */
export function ServiceHero({
  eyebrow,
  title,
  intro,
  fundingTypes,
  className,
}: ServiceHeroProps) {
  return (
    <div className={cn('py-10 md:py-16 flex flex-col gap-4 max-w-3xl', className)}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h1 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">{title}</h1>
      {intro && <div className="text-lg leading-relaxed">{intro}</div>}
      {fundingTypes && fundingTypes.length > 0 && (
        <div className="flex flex-wrap gap-2 pt-2">
          {fundingTypes.map((f) => (
            <Tag key={f} variant="outline">
              {f.toUpperCase()}
            </Tag>
          ))}
        </div>
      )}
    </div>
  )
}
