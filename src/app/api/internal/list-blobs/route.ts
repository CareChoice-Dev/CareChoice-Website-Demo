/**
 * DIAGNOSTIC — admin-only. Lists every object in the configured Vercel
 * Blob store + every Media doc in Payload so we can compare what's in
 * the store vs. what the DB thinks is there.
 *
 * Remove once the demo-hero-photos seed mystery is resolved.
 */

import { list } from '@vercel/blob'
import { getPayload } from 'payload'
import config from '@payload-config'

export const dynamic = 'force-dynamic'

export async function GET(req: Request) {
  const payload = await getPayload({ config })
  const { user } = await payload.auth({ headers: req.headers })
  if (!user) {
    return Response.json({ error: 'auth required' }, { status: 403 })
  }

  const blobs = await list({ limit: 200 })
  const media = await payload.find({
    collection: 'media',
    limit: 50,
    pagination: false,
    depth: 0,
  })

  return Response.json({
    tokenStoreId: process.env.BLOB_READ_WRITE_TOKEN?.split('_')[3] ?? null,
    blobCount: blobs.blobs.length,
    blobs: blobs.blobs.map((b) => ({
      pathname: b.pathname,
      url: b.url,
      size: b.size,
      uploadedAt: b.uploadedAt,
    })),
    mediaCount: media.docs.length,
    media: media.docs.map((m) => ({
      id: m.id,
      filename: (m as { filename?: string }).filename,
      url: (m as { url?: string }).url,
      alt: (m as { alt?: string }).alt,
    })),
  })
}
