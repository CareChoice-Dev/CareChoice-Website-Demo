'use client'

import { useId, useState } from 'react'
import { useRouter } from 'next/navigation'
import { Module } from '@/components/primitives/Module'

const VIC_REGIONS = [
  'Western',
  'Northern',
  'Eastern',
  'South Eastern',
  'Inner Melbourne',
  'Geelong & Surf Coast',
  'Bendigo & Central',
  'Ballarat & Grampians',
  'Latrobe & Gippsland',
  'Goulburn & Hume',
] as const

const ACCESS_OPTIONS = [
  { value: 'Wheelchair-accessible', label: 'Wheelchair-accessible' },
  { value: 'Robust build', label: 'Robust build' },
  { value: 'Improved liveability', label: 'Improved liveability' },
] as const

export function HelpMeFindAHome({ hrefPrefix = '' }: { hrefPrefix?: string }) {
  const router = useRouter()
  const [region, setRegion] = useState('')
  const [accessibility, setAccessibility] = useState<string[]>([])

  const regionId = useId()
  const accessHeadingId = useId()

  function toggleAccess(value: string) {
    setAccessibility((prev) =>
      prev.includes(value) ? prev.filter((v) => v !== value) : [...prev, value],
    )
  }

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (region) params.set('region', region)
    if (accessibility.length > 0) {
      params.set('accessibility', accessibility.join(','))
    }
    const qs = params.toString()
    const base = `${hrefPrefix}/find-a-home`
    router.push(qs ? `${base}?${qs}` : base)
  }

  return (
    <Module
      weight="card"
      fill="surface-pink"
      className="p-6 md:p-8 flex flex-col gap-5"
    >
      <div>
        <p className="eyebrow mb-1">Help me find a home.</p>
        <h2 className="text-2xl md:text-3xl font-bold leading-tight">
          Two quick questions and we&apos;ll narrow it down.
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="flex flex-col gap-5">
        {/* Step 1 — Region */}
        <fieldset className="flex flex-col gap-2">
          <label htmlFor={regionId} className="font-semibold text-sm">
            1. What region?
          </label>
          <select
            id={regionId}
            value={region}
            onChange={(e) => setRegion(e.target.value)}
            className="w-full max-w-md border-2 border-cc-black px-3 py-2 rounded-none bg-cc-white focus:outline-none focus:ring-0 focus:border-cc-magenta"
          >
            <option value="">Any region.</option>
            {VIC_REGIONS.map((r) => (
              <option key={r} value={r}>
                {r}
              </option>
            ))}
          </select>
        </fieldset>

        {/* Step 2 — Accessibility */}
        <fieldset className="flex flex-col gap-2">
          <legend
            id={accessHeadingId}
            className="font-semibold text-sm mb-1"
          >
            2. Any access requirements?
          </legend>
          <div className="flex flex-col gap-2">
            {ACCESS_OPTIONS.map((opt) => (
              <label
                key={opt.value}
                className="flex items-center gap-3 cursor-pointer text-sm"
              >
                <input
                  type="checkbox"
                  checked={accessibility.includes(opt.value)}
                  onChange={() => toggleAccess(opt.value)}
                  className="w-5 h-5 accent-cc-magenta"
                />
                <span>{opt.label}</span>
              </label>
            ))}
          </div>
        </fieldset>

        <div>
          <button
            type="submit"
            className="inline-flex items-center justify-center min-h-[44px] px-5 font-semibold border-2 border-cc-black bg-cc-magenta text-white rounded-none transition-[transform,box-shadow,background-color] duration-[0.15s] ease-linear motion-reduce:transition-none focus:outline-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2 hover:-translate-x-[2px] hover:-translate-y-[2px] hover:shadow-hard-btn active:translate-x-0 active:translate-y-0 active:shadow-none active:bg-cc-pms-675"
          >
            Show me homes →
          </button>
        </div>
      </form>
    </Module>
  )
}
