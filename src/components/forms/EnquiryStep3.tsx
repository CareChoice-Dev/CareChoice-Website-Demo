'use client'

import NextLink from 'next/link'
import type { EnquiryDraft } from './EnquiryForm'
import { HEARD_FROM, SALUTATIONS } from './enquiry-schema'

interface Props {
  draft: EnquiryDraft
  onChange: (patch: Partial<EnquiryDraft>) => void
  privacyPath: string
}

const inputClass =
  'w-full border-2 border-cc-black px-3 py-2 rounded-none bg-cc-white focus:outline-none focus:ring-0 focus:border-cc-magenta'
const labelClass = 'flex flex-col gap-1'
const labelTextClass = 'font-semibold text-sm'

const SALUTATION_LABELS: Record<(typeof SALUTATIONS)[number], string> = {
  'prefer-not-to-say': 'Prefer not to say',
  'Mr.': 'Mr.',
  'Mrs.': 'Mrs.',
  'Ms.': 'Ms.',
  'Mx.': 'Mx.',
  'Dr.': 'Dr.',
  'Prof.': 'Prof.',
}

const HEARD_FROM_LABELS: Record<(typeof HEARD_FROM)[number], string> = {
  'prefer-not-to-say': 'Prefer not to say',
  search: 'Search engine',
  'family-friend': 'A family member or friend',
  'allied-health': 'Allied health professional',
  'ndis-related': 'NDIS-related',
  hospital: 'Hospital or clinical referral',
  'social-media': 'Social media',
  newsletter: 'CareChoice events / newsletter',
  advertising: 'Advertising',
  other: 'Other',
}

export function EnquiryStep3({ draft, onChange, privacyPath }: Props) {
  return (
    <fieldset className="flex flex-col gap-4">
      <legend className="text-2xl font-bold leading-tight mb-2">Your contact details.</legend>

      <label className={labelClass}>
        <span className={labelTextClass}>Title.</span>
        <select
          value={draft.salutation ?? 'prefer-not-to-say'}
          onChange={(e) =>
            onChange({ salutation: e.target.value as (typeof SALUTATIONS)[number] })
          }
          className={inputClass}
        >
          {SALUTATIONS.map((s) => (
            <option key={s} value={s}>
              {SALUTATION_LABELS[s]}
            </option>
          ))}
        </select>
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>Full name.</span>
        <input
          type="text"
          required
          autoComplete="name"
          value={draft.fullName ?? ''}
          onChange={(e) => onChange({ fullName: e.target.value })}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>Email.</span>
        <input
          type="email"
          required
          autoComplete="email"
          value={draft.email ?? ''}
          onChange={(e) => onChange({ email: e.target.value })}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>Phone (optional).</span>
        <input
          type="tel"
          autoComplete="tel"
          value={draft.phone ?? ''}
          onChange={(e) => onChange({ phone: e.target.value })}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>Anything else you&apos;d like us to know?</span>
        <textarea
          rows={4}
          value={draft.message ?? ''}
          onChange={(e) => onChange({ message: e.target.value })}
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>How did you hear about us?</span>
        <select
          value={draft.heardFrom ?? 'prefer-not-to-say'}
          onChange={(e) =>
            onChange({ heardFrom: e.target.value as (typeof HEARD_FROM)[number] })
          }
          className={inputClass}
        >
          {HEARD_FROM.map((h) => (
            <option key={h} value={h}>
              {HEARD_FROM_LABELS[h]}
            </option>
          ))}
        </select>
      </label>

      <label
        htmlFor="privacy-consent"
        className="cursor-pointer border-2 border-cc-black p-4 flex items-start gap-3 bg-cc-surface-pink/40"
      >
        <input
          id="privacy-consent"
          type="checkbox"
          required
          checked={draft.privacyConsent}
          onChange={(e) => onChange({ privacyConsent: e.target.checked })}
          className="mt-1 w-5 h-5 accent-cc-magenta shrink-0"
        />
        <span className="text-sm leading-relaxed">
          I&apos;ve read the{' '}
          <NextLink href={privacyPath} className="underline font-semibold">
            Privacy Statement
          </NextLink>{' '}
          and agree to CareChoice using this information to respond to my enquiry.
        </span>
      </label>
    </fieldset>
  )
}
