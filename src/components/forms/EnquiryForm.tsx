'use client'

import { useState } from 'react'
import { EnquiryStep1 } from './EnquiryStep1'
import { EnquiryStep2 } from './EnquiryStep2'
import { EnquiryStep3 } from './EnquiryStep3'
import { Module } from '@/components/primitives/Module'
import { Button } from '@/components/primitives/Button'
import type {
  CLIENT_RELATIONSHIPS,
  EMPLOYMENT_TYPES,
  ENQUIRING_FOR,
  HEARD_FROM,
  NDIS_STATUS,
  REFERRER_ROLES,
  SALUTATIONS,
  SERVICE_INTERESTS,
} from './enquiry-schema'

export type EnquiryAudience = 'client' | 'referrer' | 'career'

export interface EnquiryDraft {
  audience: EnquiryAudience | null
  enquiringFor: (typeof ENQUIRING_FOR)[number] | null

  // Participant-shaped
  serviceInterests?: Array<(typeof SERVICE_INTERESTS)[number]>
  postcode?: string
  ndisPlan?: (typeof NDIS_STATUS)[number]
  supportNeeds?: string
  participantFirstName?: string
  natureOfDisability?: string

  // Client-other
  clientRelationship?: (typeof CLIENT_RELATIONSHIPS)[number]

  // Referrer
  organisation?: string
  referrerRole?: (typeof REFERRER_ROLES)[number]

  // Career
  careerRoleInterest?: string
  careerLocation?: string
  employmentType?: (typeof EMPLOYMENT_TYPES)[number]

  // Step 3
  salutation?: (typeof SALUTATIONS)[number]
  fullName?: string
  email?: string
  phone?: string
  heardFrom?: (typeof HEARD_FROM)[number]
  message?: string
  privacyConsent: boolean
}

const STEPS = [1, 2, 3] as const

// Keys that hold audience-conditional state. We reset these whenever the
// audience or enquiringFor changes so stale fields from a previous branch
// don't leak into the submission.
const AUDIENCE_SCOPED_KEYS: Array<keyof EnquiryDraft> = [
  'serviceInterests',
  'postcode',
  'ndisPlan',
  'supportNeeds',
  'participantFirstName',
  'natureOfDisability',
  'clientRelationship',
  'organisation',
  'referrerRole',
  'careerRoleInterest',
  'careerLocation',
  'employmentType',
]

const INITIAL_DRAFT: EnquiryDraft = {
  audience: null,
  enquiringFor: null,
  serviceInterests: [],
  ndisPlan: 'unsure',
  salutation: 'prefer-not-to-say',
  heardFrom: 'prefer-not-to-say',
  privacyConsent: false,
}

function resetAudienceScopedFields(draft: EnquiryDraft): EnquiryDraft {
  const next: EnquiryDraft = { ...draft }
  for (const key of AUDIENCE_SCOPED_KEYS) {
    delete (next as unknown as Record<string, unknown>)[key]
  }
  // Re-apply the per-branch defaults that the schema/UX expects to exist.
  next.serviceInterests = []
  next.ndisPlan = 'unsure'
  return next
}

export function EnquiryForm({
  confirmationPath,
  privacyPath,
}: {
  confirmationPath: string
  privacyPath: string
}) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [draft, setDraft] = useState<EnquiryDraft>(INITIAL_DRAFT)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const next = () => setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))
  const prev = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))

  const handleAudienceChange = (audience: EnquiryAudience) => {
    setDraft((d) => {
      if (d.audience === audience) return d
      const cleared = resetAudienceScopedFields(d)
      return {
        ...cleared,
        audience,
        // Clear the client sub-question on every audience change.
        enquiringFor: null,
      }
    })
  }

  const handleEnquiringForChange = (enquiringFor: 'self' | 'other') => {
    setDraft((d) => {
      if (d.enquiringFor === enquiringFor) return d
      const cleared = resetAudienceScopedFields(d)
      return { ...cleared, enquiringFor }
    })
  }

  const step1Ready =
    draft.audience !== null && (draft.audience !== 'client' || draft.enquiringFor !== null)
  const step3Ready =
    !!draft.fullName?.trim() && !!draft.email?.trim() && draft.privacyConsent === true

  const submit = async () => {
    setSubmitting(true)
    setError(null)
    try {
      const res = await fetch('/api/enquiry', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(draft),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        throw new Error(body.error ?? `Request failed: ${res.status}`)
      }
      window.location.href = confirmationPath
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Something went wrong.')
      setSubmitting(false)
    }
  }

  return (
    <div className="flex flex-col gap-6">
      <ol className="flex gap-0">
        {STEPS.map((n) => (
          <li
            key={n}
            aria-current={step === n ? 'step' : undefined}
            className={`flex-1 px-3 py-2 border-2 border-cc-black -ml-[2px] first:ml-0 font-semibold text-sm ${
              step === n ? 'bg-cc-magenta text-white' : step > n ? 'bg-cc-surface-pink' : 'bg-cc-white'
            }`}
          >
            {n}. {n === 1 ? 'You' : n === 2 ? 'About your enquiry' : 'Contact'}
          </li>
        ))}
      </ol>

      <Module weight="card" className="p-6 md:p-8">
        {step === 1 && (
          <EnquiryStep1
            draft={draft}
            onAudienceChange={handleAudienceChange}
            onEnquiringForChange={handleEnquiringForChange}
          />
        )}
        {step === 2 && (
          <EnquiryStep2 draft={draft} onChange={(patch) => setDraft({ ...draft, ...patch })} />
        )}
        {step === 3 && (
          <EnquiryStep3
            draft={draft}
            onChange={(patch) => setDraft({ ...draft, ...patch })}
            privacyPath={privacyPath}
          />
        )}

        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-cc-pms-675">
            {error}
          </p>
        )}

        <div className="mt-6 flex gap-3 justify-between">
          <Button
            variant="secondary"
            onClick={prev}
            disabled={step === 1}
            className={step === 1 ? 'invisible' : ''}
          >
            ← Back
          </Button>
          {step < 3 ? (
            <Button onClick={next} disabled={step === 1 && !step1Ready}>
              Continue ▸
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting || !step3Ready}>
              {submitting ? 'Sending…' : 'Send enquiry. ▸'}
            </Button>
          )}
        </div>
      </Module>
    </div>
  )
}
