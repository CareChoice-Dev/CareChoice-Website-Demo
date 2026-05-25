import { list, BlobError } from '@vercel/blob'

/**
 * Diagnostic for Vercel Blob env wiring. Tells us:
 *   - whether BLOB_READ_WRITE_TOKEN is present
 *   - the storeId extracted from the token (no random/secret leak)
 *   - whether the token + store are accepted by Vercel right now
 *     (via a 1-blob `list` call — fastest non-mutating probe)
 *
 * Hit it via `GET /api/blob-check`.
 */
export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN ?? null

  // Token format: vercel_blob_rw_<storeId>_<random>
  // The storeId is what gets embedded in client tokens and what
  // Vercel uses to identify the blob store on read/write.
  const parts = token ? token.split('_') : []
  const storeId = parts[3] ?? null

  let probe: { ok: boolean; error?: string; sample?: number } = { ok: false }
  if (token) {
    try {
      const result = await list({ token, limit: 1 })
      probe = { ok: true, sample: result.blobs.length }
    } catch (err) {
      const message =
        err instanceof BlobError
          ? err.message
          : err instanceof Error
          ? err.message
          : String(err)
      probe = { ok: false, error: message }
    }
  }

  return Response.json({
    hasToken: Boolean(token),
    tokenPrefix: token ? token.slice(0, 15) : null,
    storeId,
    tokenLength: token ? token.length : 0,
    region: process.env.VERCEL_REGION ?? null,
    probe,
  })
}
