import { Module } from '@/components/primitives/Module'
import { Button } from '@/components/primitives/Button'

export interface CTABlockProps {
  eyebrow?: string
  title: string
  body?: string
  primary: { label: string; href: string }
  secondary?: { label: string; href: string }
}

export function CTABlock({ eyebrow, title, body, primary, secondary }: CTABlockProps) {
  return (
    <Module fill="magenta" weight="default" className="p-8 md:p-12 flex flex-col gap-4">
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="text-3xl md:text-5xl font-bold leading-tight tracking-tight">{title}</h2>
      {body && <p className="text-lg leading-relaxed max-w-2xl">{body}</p>}
      <div className="flex flex-wrap gap-3 pt-2">
        <Button href={primary.href} variant="primary" size="lg">
          {primary.label} ▸
        </Button>
        {secondary && (
          <Button href={secondary.href} variant="secondary" size="lg">
            {secondary.label} ▸
          </Button>
        )}
      </div>
    </Module>
  )
}
