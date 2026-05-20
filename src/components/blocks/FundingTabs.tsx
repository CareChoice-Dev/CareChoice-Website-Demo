'use client'

import { useState, type ReactNode } from 'react'

export interface FundingTab {
  id: string
  label: string
  content: ReactNode
}

export function FundingTabs({ tabs }: { tabs: FundingTab[] }) {
  const [active, setActive] = useState<string | null>(tabs[0]?.id ?? null)

  if (tabs.length === 0) return null

  return (
    <div>
      <div role="tablist" aria-label="Funding options" className="flex flex-wrap gap-0 border-b-2 border-cc-black">
        {tabs.map((t) => {
          const isActive = t.id === active
          return (
            <button
              key={t.id}
              role="tab"
              aria-selected={isActive}
              type="button"
              onClick={() => setActive(t.id)}
              className={`px-5 py-3 border-2 border-cc-black -mb-[2px] font-semibold ${
                isActive ? 'bg-cc-magenta text-white border-b-cc-magenta' : 'bg-white text-cc-black hover:bg-cc-surface-pink'
              }`}
            >
              {t.label}
            </button>
          )
        })}
      </div>
      <div role="tabpanel" className="pt-6">
        {tabs.find((t) => t.id === active)?.content}
      </div>
    </div>
  )
}
