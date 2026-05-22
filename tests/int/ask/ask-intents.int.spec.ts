import { describe, it, expect } from 'vitest'
import { routeIntent, isBusinessHours } from '@/components/ask/ask-intents'

// Helper — build a Date that represents a wall-clock time in Australia/Melbourne.
// We use Date.UTC() with the explicit Melbourne offset. AEST is UTC+10, AEDT is UTC+11.
// Most of the test boundaries below are in AEDT (mid-year May would be AEST, but the demo
// is happening on 2026-05-21 which is AEST = UTC+10). We pass an explicit offset hour to
// keep tests deterministic.
function melbDate(opts: {
  year: number
  month: number  // 1-12
  day: number
  hour: number
  minute?: number
  /** Offset hours added by Melbourne above UTC. AEST=10, AEDT=11. */
  offsetHours: number
}): Date {
  const { year, month, day, hour, minute = 0, offsetHours } = opts
  return new Date(Date.UTC(year, month - 1, day, hour - offsetHours, minute, 0))
}

describe('isBusinessHours()', () => {
  // Use mid-year (May 2026) — AEST (UTC+10)
  it('returns false at Mon 08:59 Melbourne', () => {
    expect(isBusinessHours(melbDate({ year: 2026, month: 5, day: 18, hour: 8, minute: 59, offsetHours: 10 }))).toBe(false)
  })
  it('returns true at Mon 09:00 Melbourne', () => {
    expect(isBusinessHours(melbDate({ year: 2026, month: 5, day: 18, hour: 9, minute: 0, offsetHours: 10 }))).toBe(true)
  })
  it('returns true at Fri 16:59 Melbourne', () => {
    expect(isBusinessHours(melbDate({ year: 2026, month: 5, day: 22, hour: 16, minute: 59, offsetHours: 10 }))).toBe(true)
  })
  it('returns false at Fri 17:00 Melbourne', () => {
    expect(isBusinessHours(melbDate({ year: 2026, month: 5, day: 22, hour: 17, minute: 0, offsetHours: 10 }))).toBe(false)
  })
  it('returns false on Saturday 10:00 Melbourne', () => {
    expect(isBusinessHours(melbDate({ year: 2026, month: 5, day: 23, hour: 10, minute: 0, offsetHours: 10 }))).toBe(false)
  })
  it('returns false on Sunday 14:00 Melbourne', () => {
    expect(isBusinessHours(melbDate({ year: 2026, month: 5, day: 24, hour: 14, minute: 0, offsetHours: 10 }))).toBe(false)
  })
})

describe('routeIntent() — service intent', () => {
  const ctx = { now: melbDate({ year: 2026, month: 5, day: 19, hour: 10, offsetHours: 10 }), demoAfterHours: false }

  it('matches "what is SIL?" and returns a service intent citing SIL page', () => {
    const r = routeIntent('What is SIL?', ctx)
    expect(r.intent).toBe('service')
    expect(r.text.length).toBeGreaterThan(0)
    const hrefs = (r.sourceLinks ?? []).map((s) => s.href)
    expect(hrefs).toContain('/services/supported-independent-living')
  })

  it('matches "tell me about supported independent living"', () => {
    const r = routeIntent('Tell me about supported independent living', ctx)
    expect(r.intent).toBe('service')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/services/supported-independent-living')).toBe(true)
  })

  it('matches SDA / housing → cites find-a-home', () => {
    const r = routeIntent('What is SDA?', ctx)
    expect(r.intent).toBe('service')
    const hrefs = (r.sourceLinks ?? []).map((s) => s.href)
    expect(hrefs).toContain('/find-a-home')
  })

  it('matches complex care', () => {
    const r = routeIntent('Tell me about complex care', ctx)
    expect(r.intent).toBe('service')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/services/complex-care')).toBe(true)
  })

  it('matches positive behaviour support / PBS', () => {
    const r = routeIntent('positive behaviour support', ctx)
    expect(r.intent).toBe('service')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/services/positive-behaviour-support')).toBe(true)
  })

  it('matches rapid hospital discharge', () => {
    const r = routeIntent('rapid hospital discharge', ctx)
    expect(r.intent).toBe('service')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/services/rapid-hospital-discharge')).toBe(true)
  })

  it('matches home nursing', () => {
    const r = routeIntent('home nursing', ctx)
    expect(r.intent).toBe('service')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/services/home-nursing-disability-support')).toBe(true)
  })

  it('matches community access', () => {
    const r = routeIntent('community access services', ctx)
    expect(r.intent).toBe('service')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/services/community-access')).toBe(true)
  })

  it('matches respite', () => {
    const r = routeIntent('do you offer respite?', ctx)
    expect(r.intent).toBe('service')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/services/respite')).toBe(true)
  })

  it('matches custodial re-entry', () => {
    const r = routeIntent('custodial community re-entry', ctx)
    expect(r.intent).toBe('service')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/services/custodial-community-re-entry')).toBe(true)
  })

  it('matches TAC / WorkSafe', () => {
    const r = routeIntent('do you support TAC?', ctx)
    expect(r.intent).toBe('service')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/services/tac-worksafe-support')).toBe(true)
  })

  it('generic "what services do you offer" returns service intent with multiple links', () => {
    const r = routeIntent('What services do you offer?', ctx)
    expect(r.intent).toBe('service')
    expect((r.sourceLinks ?? []).length).toBeGreaterThanOrEqual(3)
  })

  it('service intent provides follow-up chips', () => {
    const r = routeIntent('Tell me about SIL', ctx)
    expect(r.followUpChips?.length ?? 0).toBeGreaterThan(0)
  })
})

describe('routeIntent() — homes intent', () => {
  const ctx = { now: melbDate({ year: 2026, month: 5, day: 19, hour: 10, offsetHours: 10 }), demoAfterHours: false }

  it('matches "show me homes" with no region', () => {
    const r = routeIntent('show me homes', ctx)
    expect(r.intent).toBe('homes')
    expect(r.homeLookup).toBeDefined()
    expect(r.homeLookup?.region).toBeUndefined()
  })

  it('matches "find a home in Geelong" and sets homeLookup.region', () => {
    const r = routeIntent('find a home in Geelong', ctx)
    expect(r.intent).toBe('homes')
    expect(r.homeLookup?.region).toBe('Geelong')
  })

  it('matches "available SIL homes" with homeLookup set', () => {
    const r = routeIntent('show me available SIL homes', ctx)
    expect(r.intent).toBe('homes')
    expect(r.homeLookup).toBeDefined()
  })

  it('matches "any SDA vacancies in Bendigo"', () => {
    const r = routeIntent('any SDA vacancies in Bendigo', ctx)
    expect(r.intent).toBe('homes')
    expect(r.homeLookup?.region).toBe('Bendigo')
  })

  it('homes intent always includes /find-a-home source link', () => {
    const r = routeIntent('show me homes', ctx)
    expect((r.sourceLinks ?? []).some((s) => s.href === '/find-a-home')).toBe(true)
  })
})

describe('routeIntent() — transfer-human intent', () => {
  it('returns in-hours response on Tuesday 10am Melbourne', () => {
    const r = routeIntent('I want to talk to a human', {
      now: melbDate({ year: 2026, month: 5, day: 19, hour: 10, offsetHours: 10 }),
      demoAfterHours: false,
    })
    expect(r.intent).toBe('transfer-human')
    expect(r.text.toLowerCase()).toContain('connect')
  })

  it('returns out-of-hours response on Saturday', () => {
    const r = routeIntent('can I talk to a person', {
      now: melbDate({ year: 2026, month: 5, day: 23, hour: 10, offsetHours: 10 }),
      demoAfterHours: false,
    })
    expect(r.intent).toBe('transfer-human')
    expect(r.text.toLowerCase()).toContain('offline')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/enquiry')).toBe(true)
  })

  it('honours demoAfterHours flag regardless of clock', () => {
    // Tuesday 10am Melbourne is in-hours, but demoAfterHours forces out-of-hours
    const r = routeIntent('talk to staff', {
      now: melbDate({ year: 2026, month: 5, day: 19, hour: 10, offsetHours: 10 }),
      demoAfterHours: true,
    })
    expect(r.intent).toBe('transfer-human')
    expect(r.text.toLowerCase()).toContain('offline')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/enquiry')).toBe(true)
  })

  it('matches "speak to an agent" keyword', () => {
    const r = routeIntent('I want to speak to an agent', {
      now: melbDate({ year: 2026, month: 5, day: 19, hour: 10, offsetHours: 10 }),
      demoAfterHours: false,
    })
    expect(r.intent).toBe('transfer-human')
  })
})

describe('routeIntent() — enquiry intent', () => {
  const ctx = { now: melbDate({ year: 2026, month: 5, day: 19, hour: 10, offsetHours: 10 }), demoAfterHours: false }

  it('matches "make an enquiry"', () => {
    const r = routeIntent('make an enquiry', ctx)
    expect(r.intent).toBe('enquiry')
    expect((r.sourceLinks ?? []).some((s) => s.href === '/enquiry')).toBe(true)
  })

  it('matches "how do I contact you"', () => {
    const r = routeIntent('how do I contact you', ctx)
    expect(r.intent).toBe('enquiry')
  })

  it('matches "phone number"', () => {
    const r = routeIntent('what is your phone number', ctx)
    expect(r.intent).toBe('enquiry')
  })
})

describe('routeIntent() — unknown fallback', () => {
  const ctx = { now: melbDate({ year: 2026, month: 5, day: 19, hour: 10, offsetHours: 10 }), demoAfterHours: false }

  it('routes gibberish to unknown', () => {
    const r = routeIntent('asdjkl qwerty zzz', ctx)
    expect(r.intent).toBe('unknown')
    expect(r.text.length).toBeGreaterThan(0)
  })

  it('unknown intent surfaces follow-up chips', () => {
    const r = routeIntent('asdjkl qwerty zzz', ctx)
    expect(r.followUpChips?.length ?? 0).toBeGreaterThanOrEqual(3)
  })

  it('unknown intent surfaces /search as a source link', () => {
    const r = routeIntent('asdjkl qwerty zzz', ctx)
    expect((r.sourceLinks ?? []).some((s) => s.href === '/search')).toBe(true)
  })
})
