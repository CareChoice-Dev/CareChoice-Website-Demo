'use client'

import { useEffect, Fragment, type PropsWithChildren } from 'react'
import { useConfig, useUploadHandlers } from '@payloadcms/ui'
import { upload } from '@vercel/blob/client'
import { sanitiseBlobPathname } from '@/lib/sanitise-blob-pathname'

/**
 * Overrides the Vercel Blob plugin's client upload handler for the `media`
 * collection. The plugin's handler passes `file.name` verbatim to
 * `@vercel/blob/client.upload`, which then builds the PUT URL as
 * `vercel.com/api/blob/?pathname=<that filename>`. Vercel Blob's PUT
 * validator rejects spaces, parens, `#`, etc. with 400 before the signed
 * token is ever inspected — so sanitising server-side alone isn't enough.
 *
 * Registered as a provider AFTER the plugin's provider, so React's
 * child-to-parent effect order means our `setUploadHandler('media', ...)`
 * runs last and wins the Map entry.
 */
export function MediaUploadOverride({ children }: PropsWithChildren) {
  const { setUploadHandler } = useUploadHandlers()
  const { config } = useConfig()

  useEffect(() => {
    setUploadHandler({
      collectionSlug: 'media',
      handler: async ({ file, updateFilename }) => {
        const safe = sanitiseBlobPathname(file.name)
        const endpointRoute = `${config.serverURL ?? ''}${config.routes.api}/vercel-blob-client-upload-route`

        const result = await upload(safe, file, {
          access: 'public',
          clientPayload: 'media',
          contentType: file.type,
          handleUploadUrl: endpointRoute,
        })

        const stripped = result.pathname.replace(/^\/+/, '')
        const basename = stripped.includes('/')
          ? stripped.slice(stripped.lastIndexOf('/') + 1)
          : stripped
        updateFilename(decodeURIComponent(basename))

        return { prefix: '' }
      },
    })
  }, [setUploadHandler, config])

  return <Fragment>{children}</Fragment>
}
