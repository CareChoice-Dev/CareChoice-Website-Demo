'use client'

import { useEffect, useRef, useState } from 'react'
import { ValueBlock } from './ValueBlock'
import type { Stat } from './StatsRow'

/**
 * StatsRow with a count-up: numbers animate from 0 to their target once the row
 * scrolls into view. Non-numeric values (or reduced-motion users) render the
 * final value immediately. Prefix/suffix around the number (e.g. "70%+", "800+")
 * are preserved.
 */

const DEFAULTS: Stat[] = [
  { value: '800+', label: 'Employees across Australia.', fill: 'none' },
  { value: '70%+', label: 'Of clients in 24-hour care.', fill: 'magenta' },
  { value: '30', label: 'Years supporting people with disability.', fill: 'none' },
  { value: '18', label: 'SDA homes in our directory.', fill: 'magenta' },
]

function parse(value: string): { prefix: string; target: number | null; suffix: string } {
  const m = value.match(/^(\D*)(\d+)(.*)$/)
  if (!m) return { prefix: '', target: null, suffix: value }
  return { prefix: m[1], target: parseInt(m[2], 10), suffix: m[3] }
}

export function AnimatedStatsRow({ stats = DEFAULTS }: { stats?: Stat[] }) {
  const ref = useRef<HTMLDivElement>(null)
  // `counting` is false until the client decides to animate, so the SSR/no-JS
  // render shows the FINAL values (never 0). `progress` drives the count-up.
  const [counting, setCounting] = useState(false)
  const [progress, setProgress] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return // keep final values

    const run = () => {
      setCounting(true)
      const start = performance.now()
      const duration = 1300
      const tick = (now: number) => {
        const t = Math.min(1, (now - start) / duration)
        setProgress(1 - Math.pow(1 - t, 3)) // easeOutCubic
        if (t < 1) requestAnimationFrame(tick)
      }
      requestAnimationFrame(tick)
    }

    const rect = el.getBoundingClientRect()
    const inViewNow = rect.top < window.innerHeight && rect.bottom > 0
    if (inViewNow) {
      run() // already visible (large screens) — animate from 0 immediately
      return
    }

    // Below the fold: pre-set to 0 while off-screen (no visible flash), then
    // count up when it scrolls into view.
    setCounting(true)
    setProgress(0)
    const io = new IntersectionObserver(
      (entries) => {
        if (!entries[0]?.isIntersecting) return
        io.disconnect()
        run()
      },
      { threshold: 0.4 },
    )
    io.observe(el)
    return () => io.disconnect()
  }, [])

  return (
    <div ref={ref} className="grid grid-cols-2 md:grid-cols-4 gap-0">
      {stats.map((s) => {
        const { prefix, target, suffix } = parse(s.value)
        const display =
          !counting || target === null
            ? s.value
            : `${prefix}${Math.round(target * progress)}${suffix}`
        return <ValueBlock key={s.label} value={display} label={s.label} fill={s.fill} />
      })}
    </div>
  )
}
