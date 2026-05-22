import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/newsletter/route'
import { _resetTokenCache } from '@/lib/salesforce'

function buildRequest(body: unknown) {
  return new Request('http://localhost:3000/api/newsletter', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('/api/newsletter POST', () => {
  const ORIG_ENV = process.env

  beforeEach(() => {
    process.env = {
      ...ORIG_ENV,
      SALESFORCE_INSTANCE_URL: 'https://example.my.salesforce.com',
      SALESFORCE_CLIENT_ID: 'cid',
      SALESFORCE_CLIENT_SECRET: 'cs',
      SALESFORCE_API_VERSION: '60.0',
    }
    _resetTokenCache()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    process.env = ORIG_ENV
  })

  it('returns 200 + salesforceId when Salesforce write succeeds (happy path)', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'tok' }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(
          JSON.stringify({ id: '00Q...news', success: true, errors: [] }),
          { status: 201 },
        ),
      )

    const res = await POST(
      buildRequest({ email: 'subscriber@example.com', consent: true }),
    )

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.salesforceId).toBe('00Q...news')
  })

  it('rejects an invalid email with 422', async () => {
    const res = await POST(buildRequest({ email: 'not-an-email', consent: true }))
    expect(res.status).toBe(422)
  })

  it('rejects a payload missing consent (or with consent=false) with 422', async () => {
    const res = await POST(
      buildRequest({ email: 'subscriber@example.com', consent: false }),
    )
    expect(res.status).toBe(422)
  })

  it('still returns 200 (no salesforceId) when Salesforce write fails — logs the error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'tok' }), { status: 200 }),
      )
      .mockResolvedValueOnce(new Response('Bad Request', { status: 400 }))

    const res = await POST(
      buildRequest({ email: 'subscriber@example.com', consent: true }),
    )

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.salesforceId).toBeUndefined()
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
})
