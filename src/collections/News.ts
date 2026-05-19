import type { CollectionConfig } from 'payload'

export const News: CollectionConfig = {
  slug: 'news',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'publishDate', 'author', 'updatedAt'],
  },
  access: { read: () => true },
  versions: { drafts: { autosave: true } },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug',  type: 'text', required: true, unique: true },
    { name: 'publishDate', type: 'date', required: true },
    { name: 'author', type: 'text' },
    { name: 'heroImage', type: 'upload',  relationTo: 'media' },
    { name: 'excerpt',   type: 'textarea', localized: true },
    { name: 'body',      type: 'richText', localized: true },
    {
      name: 'tags',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'NDIS',            value: 'ndis' },
        { label: 'Housing',         value: 'housing' },
        { label: 'Community',       value: 'community' },
        { label: 'Sector',          value: 'sector' },
        { label: 'CareChoice news', value: 'carechoice' },
      ],
    },
    { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
  ],
}
