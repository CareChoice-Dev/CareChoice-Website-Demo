import { ValueBlock } from './ValueBlock'

export interface OutcomeMetric {
  value: string
  label: string
}

export function OutcomeMetricsRow({ metrics }: { metrics: OutcomeMetric[] }) {
  if (metrics.length === 0) return null
  return (
    <div className="grid grid-cols-1 md:grid-cols-3 gap-0">
      {metrics.slice(0, 3).map((m, i) => (
        <ValueBlock
          key={m.label}
          value={m.value}
          label={m.label}
          fill={i % 2 === 0 ? 'none' : 'magenta'}
        />
      ))}
    </div>
  )
}
