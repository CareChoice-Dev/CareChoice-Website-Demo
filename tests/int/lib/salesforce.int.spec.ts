import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest'
import { getAccessToken, _resetTokenCache } from '@/lib/salesforce'

describe('getAccessToken', () => {
  const ORIG_ENV = process.env

  beforeEach(() => {
    process.env = {
      ...ORIG_ENV,
      SALESFORCE_INSTANCE_URL: 'https://example.my.salesforce.com',
      SALESFORCE_CLIENT_ID: 'client-id',
      SALESFORCE_CLIENT_SECRET: 'client-secret',
    }
    _resetTokenCache()
    vi.useFakeTimers()
  })

  afterEach(() => {
    process.env = ORIG_ENV
    vi.useRealTimers()
    vi.restoreAllMocks()
  })

  it('fetches a token from the OAuth endpoint', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(
        JSON.stringify({
          access_token: 'token-abc',
          instance_url: 'https://example.my.salesforce.com',
        }),
        { status: 200 },
      ),
    )

    const token = await getAccessToken()

    expect(token).toBe('token-abc')
    expect(fetchSpy).toHaveBeenCalledOnce()
    const [url, options] = fetchSpy.mock.calls[0]
    expect(url).toBe('https://example.my.salesforce.com/services/oauth2/token')
    expect(options?.method).toBe('POST')
  })

  it('caches the token across calls within the TTL', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response(JSON.stringify({ access_token: 'token-xyz' }), { status: 200 }),
    )

    await getAccessToken()
    await getAccessToken()
    await getAccessToken()

    expect(fetchSpy).toHaveBeenCalledOnce()
  })

  it('refetches after the cache TTL expires', async () => {
    const fetchSpy = vi.spyOn(global, 'fetch').mockImplementation(
      async () =>
        new Response(JSON.stringify({ access_token: 'token-1' }), { status: 200 }),
    )

    await getAccessToken()
    vi.advanceTimersByTime(60 * 60 * 1000 + 1000)
    await getAccessToken()

    expect(fetchSpy).toHaveBeenCalledTimes(2)
  })

  it('throws a descriptive error when the auth endpoint fails', async () => {
    vi.spyOn(global, 'fetch').mockResolvedValue(
      new Response('{"error": "invalid_grant"}', { status: 400 }),
    )

    await expect(getAccessToken()).rejects.toThrow(/Salesforce auth failed/)
  })
})
