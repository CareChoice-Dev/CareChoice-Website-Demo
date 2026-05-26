'use client'

import { OPEN_COOKIE_SETTINGS_EVENT } from './CookieConsent'

/**
 * Footer link that re-opens the cookie consent banner so a visitor can change
 * their choice at any time (a consent-management requirement). Styled to match
 * the other footer legal links.
 */
export function ManageCookiesButton() {
  return (
    <button
      type="button"
      onClick={() => window.dispatchEvent(new Event(OPEN_COOKIE_SETTINGS_EVENT))}
      className="underline hover:no-underline focus:outline-none focus-visible:outline-2 focus-visible:outline-cc-black focus-visible:outline-offset-2"
    >
      Manage cookies.
    </button>
  )
}
