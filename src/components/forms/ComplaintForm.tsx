'use client'

import { useState, useId } from 'react'
import NextLink from 'next/link'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const inputClass =
  'w-full border-2 border-cc-black px-3 py-2 rounded-none bg-cc-white focus:outline-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2 focus:border-cc-magenta'
const labelClass = 'flex flex-col gap-1'
const labelTextClass = 'font-semibold text-sm'

export function ComplaintForm({ phoneNumber = '1300 737 942' }: { phoneNumber?: string }) {
  const [anonymous, setAnonymous] = useState(false)
  const [fullName, setFullName] = useState('')
  const [email, setEmail] = useState('')
  const [phone, setPhone] = useState('')
  const [complaintAbout, setComplaintAbout] = useState('')
  const [whatHappened, setWhatHappened] = useState('')
  const [desiredOutcome, setDesiredOutcome] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)

  const statusId = useId()
  const phoneHref = `tel:${phoneNumber.replace(/\s+/g, '')}`

  const canSubmit =
    complaintAbout.trim().length > 0 &&
    whatHappened.trim().length > 0 &&
    consent &&
    state !== 'submitting'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return
    setState('submitting')
    setError(null)
    try {
      const res = await fetch('/api/complaint', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonymous,
          fullName: anonymous ? '' : fullName.trim(),
          email: anonymous ? '' : email.trim(),
          phone: anonymous ? '' : phone.trim(),
          complaintAbout: complaintAbout.trim(),
          whatHappened: whatHappened.trim(),
          desiredOutcome: desiredOutcome.trim(),
          consent,
        }),
      })
      if (!res.ok) {
        const b = await res.json().catch(() => ({}))
        setError(typeof b?.error === 'string' ? b.error : 'Something went wrong. Please try again.')
        setState('error')
        return
      }
      setState('success')
    } catch {
      setError('Network error. Please try again.')
      setState('error')
    }
  }

  if (state === 'success') {
    return (
      <div
        role="status"
        className="border-2 border-cc-black bg-cc-surface-pink p-6 flex flex-col gap-3"
      >
        <h2 className="text-2xl font-bold leading-tight">Thank you — we&apos;ve received it.</h2>
        <p className="text-base leading-relaxed">
          Every complaint is taken seriously and reviewed by our quality team. If you gave us
          your contact details, we&apos;ll be in touch within five business days. You can also
          call us any time on{' '}
          <a href={phoneHref} className="underline font-semibold">
            {phoneNumber}
          </a>
          .
        </p>
      </div>
    )
  }

  return (
    <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-5 max-w-2xl">
      <label
        htmlFor="complaint-anonymous"
        className="cursor-pointer border-2 border-cc-black p-4 flex items-start gap-3 bg-cc-surface-pink/40"
      >
        <input
          id="complaint-anonymous"
          type="checkbox"
          checked={anonymous}
          onChange={(e) => setAnonymous(e.target.checked)}
          className="mt-1 w-5 h-5 accent-cc-magenta shrink-0"
        />
        <span className="text-sm leading-relaxed">
          <span className="font-semibold">Make this complaint anonymously.</span> You don&apos;t
          have to tell us who you are. We can&apos;t reply directly to an anonymous complaint, but
          we still record and act on it.
        </span>
      </label>

      {!anonymous && (
        <fieldset className="flex flex-col gap-4">
          <legend className="font-semibold text-sm mb-1">Your details (optional).</legend>
          <label className={labelClass}>
            <span className={labelTextClass}>Full name.</span>
            <input
              type="text"
              autoComplete="name"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            <span className={labelTextClass}>Email.</span>
            <input
              type="email"
              autoComplete="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={inputClass}
            />
          </label>
          <label className={labelClass}>
            <span className={labelTextClass}>Phone (optional).</span>
            <input
              type="tel"
              autoComplete="tel"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              className={inputClass}
            />
          </label>
        </fieldset>
      )}

      <label className={labelClass}>
        <span className={labelTextClass}>What is your complaint about?</span>
        <input
          type="text"
          required
          value={complaintAbout}
          onChange={(e) => setComplaintAbout(e.target.value)}
          placeholder="e.g. a support worker, a home, billing, our response time"
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>What happened?</span>
        <textarea
          required
          rows={6}
          value={whatHappened}
          onChange={(e) => setWhatHappened(e.target.value)}
          placeholder="Tell us what happened, when, and who was involved if you know."
          className={inputClass}
        />
      </label>

      <label className={labelClass}>
        <span className={labelTextClass}>What would you like to see happen? (optional)</span>
        <textarea
          rows={3}
          value={desiredOutcome}
          onChange={(e) => setDesiredOutcome(e.target.value)}
          className={inputClass}
        />
      </label>

      <label
        htmlFor="complaint-consent"
        className="cursor-pointer border-2 border-cc-black p-4 flex items-start gap-3 bg-cc-surface-pink/40"
      >
        <input
          id="complaint-consent"
          type="checkbox"
          required
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-1 w-5 h-5 accent-cc-magenta shrink-0"
        />
        <span className="text-sm leading-relaxed">
          I understand CareChoice will use the information in this form to look into and respond
          to my complaint. Read our{' '}
          <NextLink href="/privacy" className="underline font-semibold">
            Privacy Statement
          </NextLink>
          .
        </span>
      </label>

      <div className="flex flex-wrap items-center gap-3">
        <button
          type="submit"
          disabled={!canSubmit}
          className="inline-flex items-center justify-center min-h-[44px] px-5 font-semibold border-2 border-cc-black bg-cc-magenta text-white rounded-none transition-[transform,box-shadow,background-color] duration-[0.15s] ease-linear motion-reduce:transition-none focus:outline-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2 hover:bg-cc-pms-675 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          {state === 'submitting' ? 'Sending…' : 'Submit complaint. ▸'}
        </button>
        {state === 'error' && error && (
          <p id={statusId} role="alert" className="text-sm font-semibold text-cc-pms-675">
            {error}
          </p>
        )}
      </div>

      <p className="text-xs text-cc-fg-muted">
        Need help completing this form? Call us on{' '}
        <a href={phoneHref} className="underline font-semibold">
          {phoneNumber}
        </a>{' '}
        or switch to{' '}
        <NextLink href="/easy-read/complaints" className="underline font-semibold">
          Easy Read
        </NextLink>
        .
      </p>
    </form>
  )
}
