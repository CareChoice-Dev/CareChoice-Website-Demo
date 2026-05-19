/**
 * Salesforce REST API client (OAuth 2.0 Client Credentials flow).
 * Tokens cached in memory for 1 hour.
 */

interface CachedToken {
  token: string
  expiresAt: number
}

const TOKEN_TTL_MS = 60 * 60 * 1000

let tokenCache: CachedToken | null = null

/** Reset cache — used in tests. */
export function _resetTokenCache(): void {
  tokenCache = null
}

export async function getAccessToken(): Promise<string> {
  const now = Date.now()
  if (tokenCache && tokenCache.expiresAt > now) {
    return tokenCache.token
  }

  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL
  const clientId = process.env.SALESFORCE_CLIENT_ID
  const clientSecret = process.env.SALESFORCE_CLIENT_SECRET

  if (!instanceUrl || !clientId || !clientSecret) {
    throw new Error('Salesforce env vars missing (INSTANCE_URL, CLIENT_ID, CLIENT_SECRET).')
  }

  const response = await fetch(`${instanceUrl}/services/oauth2/token`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: new URLSearchParams({
      grant_type: 'client_credentials',
      client_id: clientId,
      client_secret: clientSecret,
    }),
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Salesforce auth failed: ${response.status} ${body}`)
  }

  const data = (await response.json()) as { access_token: string }
  tokenCache = {
    token: data.access_token,
    expiresAt: now + TOKEN_TTL_MS,
  }
  return data.access_token
}

/** Run a SOQL query. Returns the records array directly. */
export async function runQuery<T>(soql: string): Promise<T[]> {
  const token = await getAccessToken()
  const instanceUrl = process.env.SALESFORCE_INSTANCE_URL!
  const apiVersion = process.env.SALESFORCE_API_VERSION || '60.0'

  const url = `${instanceUrl}/services/data/v${apiVersion}/query?q=${encodeURIComponent(soql)}`

  const response = await fetch(url, {
    headers: { Authorization: `Bearer ${token}` },
  })

  if (!response.ok) {
    const body = await response.text()
    throw new Error(`Salesforce query failed: ${response.status} ${body}`)
  }

  const data = (await response.json()) as { records: T[] }
  return data.records
}
