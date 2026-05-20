import type { ReactNode } from 'react'
import { Module } from '@/components/primitives/Module'
import { Button } from '@/components/primitives/Button'

export interface HeroCTA {
  label: string
  href: string
}

export interface HeroProps {
  title: string
  lead: string
  ctas?: HeroCTA[]
  /** Optional hero image (its own bordered module below the grid). */
  image?: ReactNode
}

export function Hero({ title, lead, ctas, image }: HeroProps) {
  return (
    <div className="flex flex-col gap-0">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-0">
        <Module fill="magenta" className="p-8 md:p-12 flex items-end">
          <h1 className="text-4xl md:text-6xl lg:text-7xl font-bold leading-[0.9] tracking-tight">
            {title}
          </h1>
        </Module>
        <Module
          fill="none"
          className="p-8 md:p-12 flex flex-col gap-6 justify-between -mt-[7px] md:mt-0 md:-ml-[7px]"
        >
          <p className="text-lg md:text-xl leading-relaxed max-w-prose">{lead}</p>
          {ctas && ctas.length > 0 && (
            <div className="flex flex-wrap gap-3">
              {ctas.map((cta) => (
                <Button key={cta.href} href={cta.href} variant="primary">
                  {cta.label} ▸
                </Button>
              ))}
            </div>
          )}
        </Module>
      </div>
      {image && <div className="-mt-[7px]">{image}</div>}
    </div>
  )
}
