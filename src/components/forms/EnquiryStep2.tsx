'use client'

import type { EnquiryDraft } from './EnquiryForm'

interface Props {
  draft: EnquiryDraft
  onChange: (patch: Partial<EnquiryDraft>) => void
}

const inputClass =
  'w-full border-2 border-cc-black px-3 py-2 rounded-none bg-cc-white focus:outline-none focus:ring-0 focus:border-cc-magenta'

export function EnquiryStep2({ draft, onChange }: Props) {
  if (draft.audience === 'client') {
    return (
      <fieldset className="flex flex-col gap-4">
        <legend className="text-2xl font-bold leading-tight mb-2">About your enquiry.</legend>
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-sm">What kind of support are you looking for?</span>
          <select
            value={draft.serviceInterest ?? ''}
            onChange={(e) => onChange({ serviceInterest: e.target.value })}
            className={inputClass}
          >
            <option value="">Please choose…</option>
            <option value="sil">Supported Independent Living</option>
            <option value="sda">A home (SDA)</option>
            <option value="community">Community access</option>
            <option value="complex">Complex care</option>
            <option value="other">Something else / not sure yet</option>
          </select>
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-sm">Where would you like to live? (suburb or region)</span>
          <input
            type="text"
            value={draft.homePreference ?? ''}
            onChange={(e) => onChange({ homePreference: e.target.value })}
            className={inputClass}
            placeholder="e.g. Werribee, Geelong region"
          />
        </label>
      </fieldset>
    )
  }

  if (draft.audience === 'referrer') {
    return (
      <fieldset className="flex flex-col gap-4">
        <legend className="text-2xl font-bold leading-tight mb-2">About your enquiry.</legend>
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-sm">Organisation.</span>
          <input
            type="text"
            value={draft.organisation ?? ''}
            onChange={(e) => onChange({ organisation: e.target.value })}
            className={inputClass}
          />
        </label>
        <label className="flex flex-col gap-1">
          <span className="font-semibold text-sm">Your role.</span>
          <input
            type="text"
            value={draft.role ?? ''}
            onChange={(e) => onChange({ role: e.target.value })}
            className={inputClass}
            placeholder="e.g. Support Coordinator, Case Manager"
          />
        </label>
      </fieldset>
    )
  }

  // career
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-2xl font-bold leading-tight mb-2">About your enquiry.</legend>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-sm">What kind of role are you interested in?</span>
        <input
          type="text"
          value={draft.role ?? ''}
          onChange={(e) => onChange({ role: e.target.value })}
          className={inputClass}
          placeholder="e.g. Support Worker, Team Leader, Clinical"
        />
      </label>
    </fieldset>
  )
}
