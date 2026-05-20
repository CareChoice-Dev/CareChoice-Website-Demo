import { Check } from 'lucide-react'
import { Module } from '@/components/primitives/Module'

export interface KeyPointsBlockProps {
  title: string
  points: string[]
}

export function KeyPointsBlock({ title, points }: KeyPointsBlockProps) {
  return (
    <Module weight="card" className="p-6 flex flex-col gap-3">
      <h3 className="text-2xl font-bold leading-tight">{title}</h3>
      <ul className="flex flex-col gap-2">
        {points.map((p, i) => (
          <li key={i} className="flex items-start gap-3">
            <Check className="w-5 h-5 mt-1 shrink-0 text-cc-pms-675" strokeWidth={2.5} aria-hidden="true" />
            <span className="text-base leading-relaxed">{p}</span>
          </li>
        ))}
      </ul>
    </Module>
  )
}
