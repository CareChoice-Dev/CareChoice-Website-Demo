'use client'

import { Module } from '@/components/primitives/Module'
import type { EnquiryAudience, EnquiryDraft } from './EnquiryForm'

const AUDIENCE_OPTIONS: Array<{ key: EnquiryAudience; label: string; blurb: string }> = [
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

const ENQUIRING_FOR_OPTIONS: Array<{ key: 'self' | 'other'; label: string }> = [
  { key: 'self', label: 'Myself.' },
  { key: 'other', label: 'Someone I support.' },
]

export function EnquiryStep1({
  draft,
  onAudienceChange,
  onEnquiringForChange,
}: {
  draft: EnquiryDraft
  onAudienceChange: (audience: EnquiryAudience) => void
  onEnquiringForChange: (v: 'self' | 'other') => void
}) {
  return (
    <div className="flex flex-col gap-6">
      <fieldset className="flex flex-col gap-3">
        <legend className="text-2xl font-bold leading-tight mb-2">Who are you?</legend>
        {AUDIENCE_OPTIONS.map((o) => {
          const checked = draft.audience === o.key
          const id = `audience-${o.key}`
          return (
            <Module
              key={o.key}
              weight="card"
              className={`p-0 ${
                checked
                  ? 'bg-cc-magenta text-white border-cc-magenta'
                  : 'bg-cc-white hover:bg-cc-surface-pink'
              }`}
            >
              <label
                htmlFor={id}
                className="cursor-pointer p-4 grid grid-cols-[auto_1fr] gap-x-3 gap-y-1 items-start"
              >
                <input
                  id={id}
                  type="radio"
                  name="audience"
                  value={o.key}
                  checked={checked}
                  onChange={() => onAudienceChange(o.key)}
                  className="mt-1 w-5 h-5 accent-cc-magenta row-span-2"
                />
                <span className="font-bold">{o.label}</span>
                <span className={`text-sm ${checked ? 'opacity-90' : 'text-cc-fg-muted'}`}>
                  {o.blurb}
                </span>
              </label>
            </Module>
          )
        })}
      </fieldset>

      {draft.audience === 'client' && (
        <fieldset className="flex flex-col gap-3">
          <legend className="text-lg font-bold leading-tight mb-1">
            Are you enquiring for yourself, or for someone you support?
          </legend>
          <div className="flex flex-col sm:flex-row gap-3">
            {ENQUIRING_FOR_OPTIONS.map((o) => {
              const checked = draft.enquiringFor === o.key
              const id = `enquiring-for-${o.key}`
              return (
                <Module
                  key={o.key}
                  weight="card"
                  className={`p-0 flex-1 ${
                    checked
                      ? 'bg-cc-magenta text-white border-cc-magenta'
                      : 'bg-cc-white hover:bg-cc-surface-pink'
                  }`}
                >
                  <label
                    htmlFor={id}
                    className="cursor-pointer p-3 flex items-center gap-3"
                  >
                    <input
                      id={id}
                      type="radio"
                      name="enquiringFor"
                      value={o.key}
                      checked={checked}
                      onChange={() => onEnquiringForChange(o.key)}
                      className="w-5 h-5 accent-cc-magenta"
                    />
                    <span className="font-semibold">{o.label}</span>
                  </label>
                </Module>
              )
            })}
          </div>
        </fieldset>
      )}
    </div>
  )
}
