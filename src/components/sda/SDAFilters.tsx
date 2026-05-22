'use client'

import type { SDAVacancy } from './types'
import { useMemo } from 'react'

export interface SDAFilterState {
  region: string
  designStandard: string
  availableOnly: boolean
  /**
   * Accessibility tags to match against `SDAVacancy.accessibility`.
   * Any-match (OR) semantics: a home is kept if it has at least one of these tags.
   * Used by the Help-me-find-a-home wizard to pre-apply accessibility filters via URL.
   */
  accessibility: string[]
}

export const EMPTY_FILTERS: SDAFilterState = {
  region: '',
  designStandard: '',
  availableOnly: false,
  accessibility: [],
}

export function SDAFilters({
  vacancies,
  value,
  onChange,
}: {
  vacancies: SDAVacancy[]
  value: SDAFilterState
  onChange: (next: SDAFilterState) => void
}) {
  const regions = useMemo(
    () => Array.from(new Set(vacancies.map((v) => v.region).filter(Boolean))).sort() as string[],
    [vacancies],
  )
  const designs = useMemo(
    () =>
      Array.from(new Set(vacancies.map((v) => v.designStandard).filter(Boolean))).sort() as string[],
    [vacancies],
  )

  return (
    <div className="sticky top-0 z-30 flex flex-wrap gap-3 items-center border-2 border-cc-black p-3 mb-6 bg-cc-white shadow-[0_4px_0_#000]">
      <label className="flex items-center gap-2 text-sm font-semibold">
        Region:
        <select
          className="border-2 border-cc-black px-2 py-1 rounded-none bg-cc-white"
          value={value.region}
          onChange={(e) => onChange({ ...value, region: e.target.value })}
        >
          <option value="">All</option>
          {regions.map((r) => (
            <option key={r} value={r}>{r}</option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        Design:
        <select
          className="border-2 border-cc-black px-2 py-1 rounded-none bg-cc-white"
          value={value.designStandard}
          onChange={(e) => onChange({ ...value, designStandard: e.target.value })}
        >
          <option value="">All</option>
          {designs.map((d) => (
            <option key={d} value={d}>{d}</option>
          ))}
        </select>
      </label>

      <label className="flex items-center gap-2 text-sm font-semibold">
        <input
          type="checkbox"
          className="border-2 border-cc-black w-5 h-5 rounded-none"
          checked={value.availableOnly}
          onChange={(e) => onChange({ ...value, availableOnly: e.target.checked })}
        />
        Available now only
      </label>
    </div>
  )
}
