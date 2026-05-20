import { Module } from '@/components/primitives/Module'

export interface ValueBlockProps {
  value: string
  label: string
  fill?: 'magenta' | 'none'
}

export function ValueBlock({ value, label, fill = 'none' }: ValueBlockProps) {
  return (
    <Module weight="card" fill={fill} className="p-6 flex flex-col gap-2">
      <span className="text-5xl md:text-6xl font-bold leading-none tracking-tight">{value}</span>
      <span className="text-base font-semibold">{label}</span>
    </Module>
  )
}
