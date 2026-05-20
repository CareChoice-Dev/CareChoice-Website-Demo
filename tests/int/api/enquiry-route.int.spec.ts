import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { POST } from '@/app/api/enquiry/route'
import { _resetTokenCache } from '@/lib/salesforce'

function buildRequest(body: unknown) {
  return new Request('http://localhost:3000/api/enquiry', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  })
}

describe('/api/enquiry POST', () => {
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

  it('rejects an invalid payload with 422', async () => {
    const res = await POST(buildRequest({ audience: 'unknown' }))
    expect(res.status).toBe(422)
  })

  it('returns 200 + salesforceId when Salesforce write succeeds', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'tok' }), { status: 200 }))
      .mockResolvedValueOnce(new Response(JSON.stringify({ id: '00Q...123', success: true, errors: [] }), { status: 201 }))

    const res = await POST(buildRequest({
      audience: 'client',
      fullName: 'Mira Tan',
      email: 'mira@example.com',
    }))
    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.salesforceId).toBe('00Q...123')
  })

  it('still returns 200 (success-from-user-POV) when Salesforce write fails — logs the error', async () => {
    const consoleErrorSpy = vi.spyOn(console, 'error').mockImplementation(() => {})
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'tok' }), { status: 200 }))
      .mockResolvedValueOnce(new Response('Bad Request', { status: 400 }))

    const res = await POST(buildRequest({
      audience: 'client',
      fullName: 'X',
      email: 'x@y.co',
    }))

    expect(res.status).toBe(200)
    const body = await res.json()
    expect(body.ok).toBe(true)
    expect(body.salesforceId).toBeUndefined()
    expect(consoleErrorSpy).toHaveBeenCalled()
    consoleErrorSpy.mockRestore()
  })
})
