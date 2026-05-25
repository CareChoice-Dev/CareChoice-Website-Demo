import { handleUpload, type HandleUploadBody } from '@vercel/blob/client'
import { getPayload } from 'payload'
import config from '@payload-config'
import { sanitiseBlobPathname } from '@/lib/sanitise-blob-pathname'

/**
 * Overrides the Payload Vercel Blob plugin's same-named route
 * (`@payloadcms/storage-vercel-blob/dist/getClientUploadRoute.js`).
 *
 * The plugin signs a client token using the browser-supplied `pathname`
 * verbatim. Vercel Blob's PUT validator rejects spaces, parens, `#`,
 * and other URL-special characters with a 400 — and `addRandomSuffix`
 * only applies AFTER the file is accepted, so it does not save us here.
 *
 * This route sits at a static segment so Next.js routes it ahead of
 * Payload's `[...slug]` catch-all, sanitises the pathname, then delegates
 * to `@vercel/blob/client.handleUpload` with the same options the plugin
 * uses.
 */
export async function POST(req: Request) {
  const body = (await req.json()) as HandleUploadBody

  if (
    body?.type === 'blob.generate-client-token' &&
    typeof body.payload?.pathname === 'string'
  ) {
    body.payload.pathname = sanitiseBlobPathname(body.payload.pathname)

    const payload = await getPayload({ config })
    const { user } = await payload.auth({ headers: req.headers })
    if (!user) {
      return Response.json({ error: 'Forbidden' }, { status: 403 })
    }
  }

  try {
    const jsonResponse = await handleUpload({
      body,
      onBeforeGenerateToken: async () => ({
        addRandomSuffix: true,
        cacheControlMaxAge: 60 * 60 * 24 * 365,
      }),
      onUploadCompleted: async () => {},
      request: req,
      token: process.env.BLOB_READ_WRITE_TOKEN,
    })
    return Response.json(jsonResponse)
  } catch (error) {
    console.error('[vercel-blob-client-upload-route]', error)
    return Response.json(
      { error: 'storage-vercel-blob client upload route error' },
      { status: 500 },
    )
  }
}
