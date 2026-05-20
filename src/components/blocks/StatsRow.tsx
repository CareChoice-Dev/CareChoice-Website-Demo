import { ValueBlock } from './ValueBlock'

export interface Stat {
  value: string
  label: string
  fill?: 'magenta' | 'none'
}

const DEFAULTS: Stat[] = [
  { value: '800+', label: 'Employees across Australia.', fill: 'none' },
  { value: '70%+', label: 'Of clients in 24-hour care.', fill: 'magenta' },
  { value: '30', label: 'Years supporting people with disability.', fill: 'none' },
  { value: '18', label: 'SDA homes available right now.', fill: 'magenta' },
]

export function StatsRow({ stats = DEFAULTS }: { stats?: Stat[] }) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-0">
      {stats.map((s) => (
        <ValueBlock key={s.label} value={s.value} label={s.label} fill={s.fill} />
      ))}
    </div>
  )
}
