'use client'

import { useEffect, useState } from 'react'
import NextLink from 'next/link'

const STORAGE_KEY = 'carechoice.cookie-consent'
export const OPEN_COOKIE_SETTINGS_EVENT = 'cc:open-cookie-settings'

type Choice = 'accepted' | 'rejected'

/**
 * Privacy-first cookie/consent banner.
 *
 * Shows on first visit until the visitor chooses. The choice is stored in
 * localStorage; nothing non-essential should run until consent === 'accepted'.
 * The site currently sets no tracking cookies, so this is the consent gate
 * that any future analytics must check (read getCookieConsent()).
 *
 * Re-openable from the footer "Manage cookies" link, which dispatches the
 * OPEN_COOKIE_SETTINGS_EVENT on window.
 */
export function CookieConsent() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    // Show only if no decision has been recorded yet.
    let stored: string | null = null
    try {
      stored = window.localStorage.getItem(STORAGE_KEY)
    } catch {
      /* localStorage unavailable (private mode) — show the banner */
    }
    if (stored !== 'accepted' && stored !== 'rejected') setVisible(true)

    const reopen = () => setVisible(true)
    window.addEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen)
    return () => window.removeEventListener(OPEN_COOKIE_SETTINGS_EVENT, reopen)
  }, [])

  const decide = (choice: Choice) => {
    try {
      window.localStorage.setItem(STORAGE_KEY, choice)
    } catch {
      /* noop */
    }
    setVisible(false)
  }

  if (!visible) return null

  return (
    <div
      role="dialog"
      aria-label="Cookie choices"
      aria-describedby="cookie-consent-desc"
      className="fixed bottom-0 left-0 right-0 z-[60] border-t-4 border-cc-black bg-cc-white shadow-hard-card"
    >
      <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-4 flex flex-col md:flex-row md:items-center gap-4">
        <p id="cookie-consent-desc" className="text-sm leading-relaxed flex-1">
          <span className="font-semibold">We respect your privacy.</span> We use only the cookies
          needed to make this site work. We won&apos;t turn on any analytics or other non-essential
          cookies unless you accept. Read our{' '}
          <NextLink href="/privacy" className="underline font-semibold">
            Privacy Statement
          </NextLink>
          .
        </p>
        <div className="flex gap-3 shrink-0">
          <button
            type="button"
            onClick={() => decide('rejected')}
            className="inline-flex items-center justify-center min-h-[44px] px-4 font-semibold border-2 border-cc-black bg-cc-white text-cc-black rounded-none hover:bg-cc-surface-pink focus:outline-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2"
          >
            Reject non-essential
          </button>
          <button
            type="button"
            onClick={() => decide('accepted')}
            className="inline-flex items-center justify-center min-h-[44px] px-4 font-semibold border-2 border-cc-black bg-cc-magenta text-white rounded-none hover:bg-cc-pms-675 focus:outline-none focus-visible:outline-2 focus-visible:outline-cc-magenta focus-visible:outline-offset-2"
          >
            Accept all
          </button>
        </div>
      </div>
    </div>
  )
}

/** Read the stored consent choice. Future analytics must gate on this. */
export function getCookieConsent(): Choice | null {
  if (typeof window === 'undefined') return null
  try {
    const v = window.localStorage.getItem(STORAGE_KEY)
    return v === 'accepted' || v === 'rejected' ? v : null
  } catch {
    return null
  }
}
