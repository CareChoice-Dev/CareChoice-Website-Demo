/**
 * Diagnostic endpoint for Vercel Blob env wiring.
 *
 * Tells us, without leaking the token:
 *   - whether BLOB_READ_WRITE_TOKEN is present in this lambda's env
 *   - the token's prefix (first 12 chars — official tokens start with `vercel_blob_`)
 *
 * Hit it via `GET /api/blob-check`. Delete this route once Media uploads
 * are confirmed working in production.
 */
export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN ?? null
  return Response.json({
    hasToken: Boolean(token),
    tokenPrefix: token ? token.slice(0, 12) : null,
    tokenLength: token ? token.length : 0,
    region: process.env.VERCEL_REGION ?? null,
  })
}
