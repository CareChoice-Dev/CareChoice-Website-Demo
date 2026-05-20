import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { runMutation, _resetTokenCache } from '@/lib/salesforce'

describe('runMutation', () => {
  const ORIG_ENV = process.env

  beforeEach(() => {
    process.env = {
      ...ORIG_ENV,
      SALESFORCE_INSTANCE_URL: 'https://example.my.salesforce.com',
      SALESFORCE_CLIENT_ID: 'client-id',
      SALESFORCE_CLIENT_SECRET: 'client-secret',
      SALESFORCE_API_VERSION: '60.0',
    }
    _resetTokenCache()
    vi.restoreAllMocks()
  })

  afterEach(() => {
    process.env = ORIG_ENV
    vi.restoreAllMocks()
  })

  it('POSTs to /sobjects/<Object>/ with bearer token and returns the new record id', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ access_token: 'tok-1' }), { status: 200 }),
      )
      .mockResolvedValueOnce(
        new Response(JSON.stringify({ id: '00Q5g000001abcdEAA', success: true, errors: [] }), { status: 201 }),
      )

    const result = await runMutation('Lead', { FirstName: 'Mira', LastName: 'Tan', Email: 'mira@example.com', Company: 'Personal', LeadSource: 'Website Demo' })

    expect(result).toEqual({ id: '00Q5g000001abcdEAA' })
    expect(fetchSpy).toHaveBeenCalledTimes(2)

    const [mutationUrl, mutationInit] = fetchSpy.mock.calls[1]
    expect(mutationUrl).toBe('https://example.my.salesforce.com/services/data/v60.0/sobjects/Lead/')
    expect(mutationInit?.method).toBe('POST')
    expect(mutationInit?.headers).toMatchObject({ Authorization: 'Bearer tok-1', 'Content-Type': 'application/json' })
  })

  it('throws a descriptive error on validation failure (400)', async () => {
    vi.spyOn(global, 'fetch')
      .mockResolvedValueOnce(new Response(JSON.stringify({ access_token: 'tok-2' }), { status: 200 }))
      .mockResolvedValueOnce(
        new Response(JSON.stringify([{ message: 'Required field missing', errorCode: 'REQUIRED_FIELD_MISSING' }]), { status: 400 }),
      )

    await expect(runMutation('Lead', {})).rejects.toThrow(/Salesforce mutation failed: 400/)
  })

  it('throws on auth failure (passes through the runQuery auth error path)', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValueOnce(
      new Response('{"error":"invalid_grant"}', { status: 400 }),
    )
    await expect(runMutation('Lead', { LastName: 'X', Company: 'Y' })).rejects.toThrow(/Salesforce auth failed/)
  })
})
