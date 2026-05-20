'use client'

import { useState } from 'react'
import { EnquiryStep1 } from './EnquiryStep1'
import { EnquiryStep2 } from './EnquiryStep2'
import { EnquiryStep3 } from './EnquiryStep3'
import { Module } from '@/components/primitives/Module'
import { Button } from '@/components/primitives/Button'

export type EnquiryAudience = 'client' | 'referrer' | 'career'

export interface EnquiryDraft {
  audience: EnquiryAudience | null
  serviceInterest?: string
  homePreference?: string
  organisation?: string
  role?: string
  fullName?: string
  email?: string
  phone?: string
  message?: string
}

const STEPS = [1, 2, 3] as const

export function EnquiryForm({ confirmationPath }: { confirmationPath: string }) {
  const [step, setStep] = useState<1 | 2 | 3>(1)
  const [draft, setDraft] = useState<EnquiryDraft>({ audience: null })
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const next = () => setStep((s) => (s < 3 ? ((s + 1) as 1 | 2 | 3) : s))
  const prev = () => setStep((s) => (s > 1 ? ((s - 1) as 1 | 2 | 3) : s))

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
            value={draft.audience}
            onChange={(audience) => setDraft({ ...draft, audience })}
          />
        )}
        {step === 2 && <EnquiryStep2 draft={draft} onChange={(patch) => setDraft({ ...draft, ...patch })} />}
        {step === 3 && <EnquiryStep3 draft={draft} onChange={(patch) => setDraft({ ...draft, ...patch })} />}

        {error && (
          <p role="alert" className="mt-4 text-sm font-semibold text-cc-pms-675">{error}</p>
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
            <Button onClick={next} disabled={step === 1 && !draft.audience}>
              Continue ▸
            </Button>
          ) : (
            <Button onClick={submit} disabled={submitting || !draft.fullName || !draft.email}>
              {submitting ? 'Sending…' : 'Send enquiry. ▸'}
            </Button>
          )}
        </div>
      </Module>
    </div>
  )
}
