import type { CollectionConfig } from 'payload'

export const Media: CollectionConfig = {
  slug: 'media',
  upload: {
    staticDir: 'media',
    mimeTypes: ['image/*', 'video/*', 'application/pdf'],
    imageSizes: [
      { name: 'thumbnail', width: 400,  height: 300, position: 'centre' },
      { name: 'card',      width: 800,  height: 600, position: 'centre' },
      { name: 'hero',      width: 1600, height: 900, position: 'centre' },
    ],
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
