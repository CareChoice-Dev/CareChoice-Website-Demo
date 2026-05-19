import type { CollectionConfig } from 'payload'

export const AudiencePathways: CollectionConfig = {
  slug: 'audience-pathways',
  admin: { useAsTitle: 'label' },
  access: { read: () => true },
  fields: [
    { name: 'label',       type: 'text',     required: true, localized: true },
    { name: 'description', type: 'textarea', localized: true },
    { name: 'targetUrl',   type: 'text',     required: true },
    {
      name: 'icon',
      type: 'text',
      admin: { description: 'Lucide icon name (e.g. "users", "briefcase").' },
    },
    { name: 'image',     type: 'upload', relationTo: 'media' },
    { name: 'sortOrder', type: 'number', defaultValue: 0 },
  ],
}
