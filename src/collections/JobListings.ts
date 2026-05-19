import type { CollectionConfig } from 'payload'

export const JobListings: CollectionConfig = {
  slug: 'job-listings',
  admin: {
    useAsTitle: 'title',
    defaultColumns: ['title', 'location', 'employmentType', 'updatedAt'],
  },
  access: { read: () => true },
  fields: [
    { name: 'title',    type: 'text', required: true },
    { name: 'slug',     type: 'text', required: true, unique: true },
    { name: 'location', type: 'text' },
    {
      name: 'employmentType',
      type: 'select',
      options: [
        { label: 'Full-time', value: 'full-time' },
        { label: 'Part-time', value: 'part-time' },
        { label: 'Casual',    value: 'casual' },
        { label: 'Contract',  value: 'contract' },
      ],
    },
    { name: 'summary', type: 'textarea' },
    { name: 'body',    type: 'richText' },
  ],
}
