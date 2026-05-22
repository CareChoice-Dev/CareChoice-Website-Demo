'use client'

import { useState } from 'react'
import type { SDAVacancy } from './types'
import { SDAFilters, EMPTY_FILTERS, type SDAFilterState } from './SDAFilters'
import { SDAHomeCard } from './SDAHomeCard'

/**
 * Read filter pre-sets from URL search params.
 *
 * Used so the Help-me-find-a-home wizard can deep-link to a pre-filtered grid view
 * via `/find-a-home?region=...&accessibility=a,b&availableOnly=1`.
 *
 * Lazy useState initialiser — runs once on mount on the client. SSR/first paint
 * starts with empty filters, which is fine because the grid is fully driven client-side.
 */
function initialFiltersFromUrl(): SDAFilterState {
  if (typeof window === 'undefined') return EMPTY_FILTERS
  const params = new URLSearchParams(window.location.search)
  const region = params.get('region') ?? ''
  const designStandard = params.get('designStandard') ?? ''
  const availableOnly = params.get('availableOnly') === '1'
  const accessibility = (params.get('accessibility') ?? '')
    .split(',')
    .map((s) => s.trim())
    .filter(Boolean)
  return { region, designStandard, availableOnly, accessibility }
}

export function SDAGrid({ vacancies, hrefPrefix }: { vacancies: SDAVacancy[]; hrefPrefix: string }) {
  const [filters, setFilters] = useState<SDAFilterState>(initialFiltersFromUrl)

  const filtered = vacancies.filter((v) => {
    if (filters.region && v.region !== filters.region) return false
    if (filters.designStandard && v.designStandard !== filters.designStandard) return false
    if (filters.availableOnly && v.availableBeds === 0) return false
    if (filters.accessibility.length > 0) {
      const hasMatch = filters.accessibility.some((tag) =>
        v.accessibility.some((vTag) => vTag.toLowerCase() === tag.toLowerCase()),
      )
      if (!hasMatch) return false
    }
    return true
  })

  return (
    <div>
      <SDAFilters vacancies={vacancies} value={filters} onChange={setFilters} />
      {filtered.length === 0 ? (
        <p className="text-base text-cc-fg-muted">
          No homes match your filters. Try adjusting them, or make an enquiry and we&apos;ll keep you posted.
        </p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filtered.map((home, i) => (
            <SDAHomeCard key={home.id} home={home} hrefPrefix={hrefPrefix} eager={i < 3} />
          ))}
        </div>
      )}
      <p className="text-xs text-cc-fg-muted mt-6">
        {filtered.length} of {vacancies.length} homes shown. Data refreshes from Salesforce every 10 minutes.
      </p>
    </div>
  )
}
