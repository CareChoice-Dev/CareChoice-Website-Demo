'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

/**
 * Compact home-finder for the homepage hero. Replaces the earlier decorative
 * tiles with a working tool: pick a support level (+ optionally available-now)
 * and deep-link straight into /find-a-home pre-filtered.
 *
 * Filters on SDA design standard + availability — the fields the Salesforce
 * data actually populates (region/accessibility tags are too sparse to be
 * useful here). The official "C" mark floats in the corner as a brand accent.
 */

// Real values from the live SDA directory.
const DESIGN_STANDARDS = ['Fully Accessible', 'High Physical Support', 'Robust'] as const

export function HeroHomeFinder({ hrefPrefix = '' }: { hrefPrefix?: string }) {
  const router = useRouter()
  const [design, setDesign] = useState('')
  const [availableOnly, setAvailableOnly] = useState(false)

  function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    const params = new URLSearchParams()
    if (design) params.set('design', design)
    if (availableOnly) params.set('available', '1')
    const qs = params.toString()
    router.push(qs ? `${hrefPrefix}/find-a-home?${qs}` : `${hrefPrefix}/find-a-home`)
  }

  return (
    <div className="relative mt-6">
      {/* Official "C" mark, floating as a brand accent behind the card corner. */}
      <div className="cc-logo-float pointer-events-none absolute -top-10 -right-4 z-0 w-[120px] h-[120px] hidden md:block">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src="/brand/logo-c-art.svg"
          alt=""
          aria-hidden="true"
          className="cc-logo-pop w-full h-full object-contain opacity-90"
        />
      </div>

      <form
        onSubmit={handleSubmit}
        aria-label="Find an available home"
        className="relative z-10 flex flex-col gap-4 border-2 border-cc-black bg-cc-surface-pink p-5 shadow-[6px_6px_0_#000]"
      >
        <div>
          <p className="eyebrow text-cc-magenta">Find a home.</p>
          <p className="text-lg font-bold leading-tight">See what suits you — in seconds.</p>
        </div>

        <label className="flex flex-col gap-1">
          <span className="font-semibold text-sm">Level of support</span>
          <select
            value={design}
            onChange={(e) => setDesign(e.target.value)}
            className="border-2 border-cc-black px-3 py-2 rounded-none bg-cc-white font-semibold focus:outline-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2 focus:border-cc-magenta"
          >
            <option value="">Any home design</option>
            {DESIGN_STANDARDS.map((d) => (
              <option key={d} value={d}>
                {d}
              </option>
            ))}
          </select>
        </label>

        <label className="flex items-center gap-3 cursor-pointer text-sm font-semibold">
          <input
            type="checkbox"
            checked={availableOnly}
            onChange={(e) => setAvailableOnly(e.target.checked)}
            className="w-5 h-5 accent-cc-magenta border-2 border-cc-black"
          />
          Only show homes with a vacancy now
        </label>

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 min-h-[44px] px-5 font-semibold border-2 border-cc-black bg-cc-magenta text-white rounded-none shadow-hard-btn hover:bg-cc-pms-675 transition-colors motion-reduce:transition-none focus:outline-none focus-visible:outline-2 focus-visible:outline-cc-black focus-visible:outline-offset-2"
        >
          Show me homes ▸
        </button>
      </form>
    </div>
  )
}
