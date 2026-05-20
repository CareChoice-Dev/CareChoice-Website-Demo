'use client'

import { Module } from '@/components/primitives/Module'
import type { EnquiryAudience } from './EnquiryForm'

const OPTIONS: Array<{ key: EnquiryAudience; label: string; blurb: string }> = [
  {
    key: 'client',
    label: 'I am a client or family member.',
    blurb: 'You or someone you support is looking at our services.',
  },
  {
    key: 'referrer',
    label: 'I am a professional referrer.',
    blurb: 'You are a support coordinator, case manager, or similar.',
  },
  {
    key: 'career',
    label: 'I want to work at CareChoice.',
    blurb: 'You are interested in a role with us.',
  },
]

export function EnquiryStep1({
  value,
  onChange,
}: {
  value: EnquiryAudience | null
  onChange: (audience: EnquiryAudience) => void
}) {
  return (
    <fieldset className="flex flex-col gap-3">
      <legend className="text-2xl font-bold leading-tight mb-2">Who are you?</legend>
      {OPTIONS.map((o) => {
        const checked = value === o.key
        const id = `audience-${o.key}`
        return (
          <Module
            key={o.key}
            weight="card"
            className={`p-0 ${
              checked ? 'bg-cc-magenta text-white border-cc-magenta' : 'bg-cc-white hover:bg-cc-surface-pink'
            }`}
          >
            <label htmlFor={id} className="cursor-pointer p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-start">
              <input
                id={id}
                type="radio"
                name="audience"
                value={o.key}
                checked={checked}
                onChange={() => onChange(o.key)}
                className="mt-1 w-5 h-5 accent-cc-magenta row-span-2"
              />
              <span className="font-bold">{o.label}</span>
              <span className={`text-sm ${checked ? 'opacity-90' : 'text-cc-fg-muted'}`}>{o.blurb}</span>
            </label>
          </Module>
        )
      })}
    </fieldset>
  )
}
