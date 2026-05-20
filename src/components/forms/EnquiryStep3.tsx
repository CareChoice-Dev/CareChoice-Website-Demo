'use client'

import type { EnquiryDraft } from './EnquiryForm'

interface Props {
  draft: EnquiryDraft
  onChange: (patch: Partial<EnquiryDraft>) => void
}

const inputClass =
  'w-full border-2 border-cc-black px-3 py-2 rounded-none bg-cc-white focus:outline-none focus:ring-0 focus:border-cc-magenta'

export function EnquiryStep3({ draft, onChange }: Props) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-2xl font-bold leading-tight mb-2">Your contact details.</legend>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-sm">Full name.</span>
        <input
          type="text"
          required
          autoComplete="name"
          value={draft.fullName ?? ''}
          onChange={(e) => onChange({ fullName: e.target.value })}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-sm">Email.</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={draft.email ?? ''}
          onChange={(e) => onChange({ email: e.target.value })}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-sm">Phone (optional).</span>
        <input
          type="tel"
          autoComplete="tel"
          value={draft.phone ?? ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          className={inputClass}
        />
      </label>
      <label className="flex flex-col gap-1">
        <span className="font-semibold text-sm">Anything else you&apos;d like us to know?</span>
        <textarea
          rows={4}
          value={draft.message ?? ''}
          onChange={(e) => onChange({ message: e.target.value })}
          className={inputClass}
        />
      </label>
    </fieldset>
  )
}
