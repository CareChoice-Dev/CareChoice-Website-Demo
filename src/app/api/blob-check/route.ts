import { list, put, del, BlobError } from '@vercel/blob'
import { generateClientTokenFromReadWriteToken } from '@vercel/blob/client'

// Mirror the override in payload.config.ts so that runtimes which load
// this diagnostic without going through Payload still see the right
// token. Safe to remove once the Vercel env var prefix is cleared.
if (process.env.BLOB_PUB_BLOB_READ_WRITE_TOKEN) {
  process.env.BLOB_READ_WRITE_TOKEN = process.env.BLOB_PUB_BLOB_READ_WRITE_TOKEN
}

/**
 * Diagnostic for Vercel Blob env wiring. Three probes:
 *   - list({ token })       → confirms token + store accept reads
 *   - put + del              → confirms server-side writes work via
 *                              the same `vercel.com/api/blob/` API
 *                              the client SDK uses
 *   - generateClientToken    → mints a client token server-side so
 *                              we can inspect the format Vercel
 *                              should be accepting (no leak — only
 *                              prefix shown)
 *
 * Hit it via `GET /api/blob-check`.
 */
export async function GET() {
  const token = process.env.BLOB_READ_WRITE_TOKEN ?? null
  const parts = token ? token.split('_') : []
  const storeId = parts[3] ?? null

  const out: Record<string, unknown> = {
    hasToken: Boolean(token),
    tokenPrefix: token ? token.slice(0, 15) : null,
    storeId,
    tokenLength: token ? token.length : 0,
    region: process.env.VERCEL_REGION ?? null,
  }

  if (!token) return Response.json(out)

  // Probe 1: list — proven to work; keep as a baseline.
  try {
    const r = await list({ token, limit: 1 })
    out.listProbe = { ok: true, count: r.blobs.length }
  } catch (err) {
    out.listProbe = { ok: false, error: errorMessage(err) }
  }

  // Probe 2: server-side put + del — does the same vercel.com/api/blob
  // endpoint accept a write from this token?
  try {
    const r = await put('_diag/probe.txt', 'probe', {
      token,
      access: 'public',
      addRandomSuffix: true,
      allowOverwrite: true,
      contentType: 'text/plain',
    })
    out.putProbe = { ok: true, url: r.url }
    try {
      await del(r.url, { token })
    } catch {
      // best-effort cleanup; ignore
    }
  } catch (err) {
    out.putProbe = { ok: false, error: errorMessage(err) }
  }

  // Probe 3: generate a client token and report its shape. We're not
  // executing the PUT — that has to come from the browser. But the
  // prefix tells us if our SDK is producing the format Vercel expects.
  try {
    const clientToken = await generateClientTokenFromReadWriteToken({
      token,
      pathname: 'diag/probe.txt',
      addRandomSuffix: true,
    })
    out.clientTokenProbe = {
      ok: true,
      prefix: clientToken.slice(0, 40),
      length: clientToken.length,
    }
  } catch (err) {
    out.clientTokenProbe = { ok: false, error: errorMessage(err) }
  }

  return Response.json(out)
}

function errorMessage(err: unknown): string {
  if (err instanceof BlobError) return err.message
  if (err instanceof Error) return err.message
  return String(err)
}
