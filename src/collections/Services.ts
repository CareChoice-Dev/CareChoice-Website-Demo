import type { CollectionConfig } from 'payload'

export const Services: CollectionConfig = {
  slug: 'services',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'slug', 'category', 'updatedAt'],
  },
  access: { read: () => true },
  versions: { drafts: { autosave: true } },
  fields: [
    { name: 'title', type: 'text', required: true, localized: true },
    { name: 'slug',  type: 'text', required: true, unique: true },
    {
      name: 'category',
      type: 'select',
      required: true,
      options: [
        { label: 'Disability Services', value: 'disability-services' },
        { label: 'Complex Care',        value: 'complex-care' },
        { label: 'Specialist Services', value: 'specialist-services' },
        { label: 'Housing',             value: 'housing' },
      ],
    },
    {
      name: 'fundingTypes',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'NDIS',     value: 'ndis' },
        { label: 'TAC',      value: 'tac' },
        { label: 'WorkSafe', value: 'worksafe' },
        { label: 'Private',  value: 'private' },
      ],
    },
    { name: 'heroImage', type: 'upload',  relationTo: 'media' },
    { name: 'intro',     type: 'textarea', localized: true },
    { name: 'content',   type: 'richText', localized: true },
    {
      name: 'whoThisIsFor',
      type: 'array',
      localized: true,
      admin: { description: 'Bulleted "Who this is for" list rendered on /services/<slug>.' },
      fields: [{ name: 'point', type: 'text', required: true }],
    },
    {
      name: 'whatsIncluded',
      type: 'array',
      localized: true,
      admin: { description: 'Bulleted "What\'s included" list rendered on /services/<slug>.' },
      fields: [{ name: 'point', type: 'text', required: true }],
    },
    {
      name: 'eligibility',
      type: 'textarea',
      localized: true,
      admin: { description: 'Plain-text "Eligibility & funding" paragraph.' },
    },
    {
      name: 'faq',
      type: 'array',
      localized: true,
      admin: { description: 'Optional FAQ section on /services/<slug>.' },
      fields: [
        { name: 'question', type: 'text', required: true },
        { name: 'answer',   type: 'textarea', required: true },
      ],
    },
    { name: 'relatedServices', type: 'relationship', relationTo: 'services', hasMany: true },
    {
      name: 'easyReadPdf',
      type: 'upload',
      relationTo: 'media',
      admin: { description: 'Optional downloadable Easy Read PDF version.' },
    },
  ],
}
