import type { CollectionConfig } from 'payload'

export const CaseStudies: CollectionConfig = {
  slug: 'case-studies',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'participantName', 'consentRecorded', 'updatedAt'],
  },
  access: { read: () => true },
  versions: { drafts: { autosave: true } },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug',  type: 'text', required: true, unique: true },
    {
      name: 'participantName',
      type: 'text',
      required: true,
      admin: { description: 'Full name or pseudonym. Mark consent below.' },
    },
    {
      name: 'consentRecorded',
      type: 'checkbox',
      required: true,
      defaultValue: false,
      admin: { description: 'Confirm written consent on file before publishing.' },
    },
    { name: 'heroImage', type: 'upload',  relationTo: 'media' },
    { name: 'summary',   type: 'textarea', localized: true },
    { name: 'servicesUsed', type: 'relationship', relationTo: 'services', hasMany: true },
    {
      name: 'outcomeMetrics',
      type: 'array',
      fields: [
        { name: 'label', type: 'text', required: true, localized: true },
        { name: 'value', type: 'text', required: true, localized: true },
      ],
    },
    { name: 'quote', type: 'textarea', localized: true },
    { name: 'story', type: 'richText', localized: true },
  ],
}
