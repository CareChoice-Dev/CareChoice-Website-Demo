'use client'

import { useState } from 'react'
import type { SDAVacancy } from './types'
import { SDAFilters, EMPTY_FILTERS, type SDAFilterState } from './SDAFilters'
import { SDAHomeCard } from './SDAHomeCard'

export function SDAGrid({ vacancies, hrefPrefix }: { vacancies: SDAVacancy[]; hrefPrefix: string }) {
  const [filters, setFilters] = useState<SDAFilterState>(EMPTY_FILTERS)

  const filtered = vacancies.filter((v) => {
    if (filters.region && v.region !== filters.region) return false
    if (filters.designStandard && v.designStandard !== filters.designStandard) return false
    if (filters.availableOnly && v.availableBeds === 0) return false
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
          {filtered.map((home) => (
            <SDAHomeCard key={home.id} home={home} hrefPrefix={hrefPrefix} />
          ))}
        </div>
      )}
      <p className="text-xs text-cc-fg-muted mt-6">
        {filtered.length} of {vacancies.length} homes shown. Data refreshes from Salesforce every 10 minutes.
      </p>
    </div>
  )
}
