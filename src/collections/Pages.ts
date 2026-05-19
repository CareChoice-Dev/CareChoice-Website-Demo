import type { CollectionConfig } from 'payload'

export const Pages: CollectionConfig = {
  slug: 'pages',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'updatedAt'],
  },
  access: { read: () => true },
  versions: { drafts: { autosave: true } },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    {
      name: 'slug',
      type: 'text',
      required: true,
      unique: true,
      admin: { description: 'URL path segment. Lower-case, hyphenated.' },
    },
    { name: 'heroImage', type: 'upload', relationTo: 'media' },
    {
      name: 'intro',
      type: 'textarea',
      localized: true,
      admin: { description: 'Short lead paragraph. Headlines end with a full stop.' },
    },
    { name: 'content', type: 'richText', localized: true },
    {
      name: 'seo',
      type: 'group',
      fields: [
        { name: 'metaTitle',       type: 'text',     localized: true },
        { name: 'metaDescription', type: 'textarea', localized: true },
        { name: 'ogImage',         type: 'upload',   relationTo: 'media' },
      ],
    },
  ],
}
