import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    // imageSizes intentionally removed — when combined with the Vercel
    // Blob plugin's `addRandomSuffix:true`, the adapter mutates
    // `data.filename` once per size upload (see
    // node_modules/@payloadcms/storage-vercel-blob/dist/adapter.js).
    // The last size's randomly-suffixed name overwrites the main file's
    // filename, leaving Payload pointing at an object that doesn't
    // exist in Blob and the `/api/media/file/...` proxy 404s.
    // next/image handles responsive sizing at request time, so the loss
    // is minimal. Restore once the plugin separates main-vs-size filename
    // handling.
    //
  },
  admin: {
    useAsTitle: 'filename',
    defaultColumns: ['filename', 'alt', 'updatedAt'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'alt',
      type: 'text',
      required: true,
      admin: {
        description:
          'Required for accessibility. For decorative images, write a short description; never leave blank.',
      },
    },
    { name: 'caption', type: 'text' },
    {
      name: 'credit',
      type: 'text',
      admin: { description: 'Photographer or source attribution.' },
    },
    {
      name: 'isDecorative',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Set true only for purely decorative images. Even then, alt text describing the asset is required for catalogue search.',
      },
    },
  ],
}
