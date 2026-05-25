'use client'

import { useState } from 'react'
import { EnquiryStep1 } from './EnquiryStep1'
import { EnquiryStep2 } from './EnquiryStep2'
import { EnquiryStep3 } from './EnquiryStep3'
import { Module } from '@/components/primitives/Module'
import { Button } from '@/components/primitives/Button'
import type {
  EMPLOYMENT_TYPES,
  ENQUIRING_FOR,
  FUNDING_PLAN,
  HEARD_FROM,
  RELATIONSHIPS,
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
  fundingPlan?: (typeof FUNDING_PLAN)[number]
  supportNeeds?: string
  participantFirstName?: string
  natureOfDisability?: string

  // Single relationship field (used by client/other AND referrer)
  relationshipToParticipant?: (typeof RELATIONSHIPS)[number]

  // Referrer
  organisation?: string

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
  'fundingPlan',
  'supportNeeds',
  'participantFirstName',
  'natureOfDisability',
  'relationshipToParticipant',
  'organisation',
  'careerRoleInterest',
  'careerLocation',
  'employmentType',
]

const INITIAL_DRAFT: EnquiryDraft = {
  audience: null,
  enquiringFor: null,
  serviceInterests: [],
  fundingPlan: 'Unsure',
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
  next.fundingPlan = 'Unsure'
  return next
}

export function EnquiryForm({
  confirmationPath,
  privacyPath,
  phoneNumber = '1300 737 942',
}: {
  confirmationPath: string
  privacyPath: string
  /** Display phone number for the "prefer to talk" callout. Falls back to the default. */
  phoneNumber?: string
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

  const phoneHref = `tel:${phoneNumber.replace(/\s+/g, '')}`

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

      <div
        role="note"
        className="flex flex-wrap items-center justify-between gap-3 border-2 border-cc-black bg-cc-surface-pink px-4 py-3 text-sm"
      >
        <span>
          <span className="font-semibold">Prefer to talk?</span> Call our intake team on{' '}
          business days.
        </span>
        <a
          href={phoneHref}
          className="inline-flex items-center gap-2 font-semibold text-cc-black hover:underline focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2"
          aria-label={`Call CareChoice on ${phoneNumber}`}
        >
          <svg
            aria-hidden="true"
            viewBox="0 0 24 24"
            className="w-4 h-4"
            fill="none"
            stroke="currentColor"
            strokeWidth="2.5"
            strokeLinecap="round"
            strokeLinejoin="round"
          >
            <path d="M22 16.92v3a2 2 0 0 1-2.18 2 19.79 19.79 0 0 1-8.63-3.07 19.5 19.5 0 0 1-6-6 19.79 19.79 0 0 1-3.07-8.67A2 2 0 0 1 4.11 2h3a2 2 0 0 1 2 1.72c.13.96.37 1.9.7 2.81a2 2 0 0 1-.45 2.11L8.09 9.91a16 16 0 0 0 6 6l1.27-1.27a2 2 0 0 1 2.11-.45c.91.33 1.85.57 2.81.7A2 2 0 0 1 22 16.92Z" />
          </svg>
          {phoneNumber}
        </a>
      </div>

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
