'use client'

import { useState, useId } from 'react'
import NextLink from 'next/link'

type SubmitState = 'idle' | 'submitting' | 'success' | 'error'

const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/

export function NewsletterSignup() {
  const [email, setEmail] = useState('')
  const [consent, setConsent] = useState(false)
  const [state, setState] = useState<SubmitState>('idle')
  const [error, setError] = useState<string | null>(null)

  const emailId = useId()
  const consentId = useId()
  const statusId = useId()

  const emailValid = EMAIL_RE.test(email.trim())
  const canSubmit = emailValid && consent && state !== 'submitting'

  async function handleSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (!canSubmit) return

    setState('submitting')
    setError(null)
    try {
      const res = await fetch('/api/newsletter', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email: email.trim(), consent }),
      })
      if (!res.ok) {
        const body = await res.json().catch(() => ({}))
        setError(
          typeof body?.error === 'string'
            ? body.error
            : 'Something went wrong. Please try again.',
        )
        setState('error')
        return
      }
      setState('success')
      setEmail('')
      setConsent(false)
    } catch {
      setError('Network error. Please try again.')
      setState('error')
    }
  }

  return (
    <section
      aria-labelledby="newsletter-heading"
      className="border-t-2 border-cc-black pt-6"
    >
      <div className="bg-cc-black text-white p-6 md:p-8 border-2 border-cc-black">
        <h3
          id="newsletter-heading"
          className="text-2xl md:text-3xl font-bold leading-tight mb-2"
        >
          Stay in the loop.
        </h3>
        <p className="text-sm md:text-base mb-5 max-w-prose">
          Quarterly news on new homes, services, and ways CareChoice can support
          your community.
        </p>

        {state === 'success' ? (
          <p
            id={statusId}
            role="status"
            className="bg-cc-magenta text-white border-2 border-white p-4 font-semibold"
          >
            Thanks. You&apos;re on the list — we&apos;ll be in touch.
          </p>
        ) : (
          <form
            onSubmit={handleSubmit}
            noValidate
            className="flex flex-col gap-4"
            aria-describedby={state === 'error' ? statusId : undefined}
          >
            <label htmlFor={emailId} className="flex flex-col gap-1">
              <span className="font-semibold text-sm">Email address.</span>
              <input
                id={emailId}
                type="email"
                required
                autoComplete="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="you@example.com"
                className="w-full max-w-md border-2 border-white bg-cc-black text-white px-3 py-2 rounded-none focus:outline-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 focus:border-cc-magenta placeholder:text-white/50"
              />
            </label>

            <label
              htmlFor={consentId}
              className="cursor-pointer flex items-start gap-3 text-sm"
            >
              <input
                id={consentId}
                type="checkbox"
                required
                checked={consent}
                onChange={(e) => setConsent(e.target.checked)}
                className="mt-1 w-5 h-5 accent-cc-magenta shrink-0"
              />
              <span className="leading-relaxed">
                I agree to receive the CareChoice newsletter. By signing up you
                agree to our{' '}
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
                className="inline-flex items-center justify-center min-h-[44px] px-5 font-semibold border-2 border-white bg-cc-magenta text-white rounded-none transition-[transform,box-shadow,background-color] duration-[0.15s] ease-linear motion-reduce:transition-none focus:outline-none focus-visible:outline-2 focus-visible:outline-white focus-visible:outline-offset-2 hover:bg-cc-pms-675 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {state === 'submitting' ? 'Signing up…' : 'Sign me up.'}
              </button>
              {state === 'error' && error && (
                <p
                  id={statusId}
                  role="alert"
                  className="text-sm text-white font-semibold"
                >
                  {error}
                </p>
              )}
            </div>
          </form>
        )}
      </div>
    </section>
  )
}
