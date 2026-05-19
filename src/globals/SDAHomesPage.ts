import type { GlobalConfig } from 'payload'

export const SDAHomesPage: GlobalConfig = {
  slug: 'sda-homes-page',
  access: { read: () => true },
  fields: [
    {
      name: 'title',
      type: 'text',
      required: true,
      localized: true,
      defaultValue: 'Find a home.',
    },
    { name: 'intro', type: 'textarea', localized: true },
    {
      name: 'filterLabels',
      type: 'group',
      fields: [
        { name: 'region',       type: 'text', localized: true, defaultValue: 'Region' },
        { name: 'design',       type: 'text', localized: true, defaultValue: 'Design category' },
        { name: 'bedrooms',     type: 'text', localized: true, defaultValue: 'Bedrooms' },
        { name: 'availability', type: 'text', localized: true, defaultValue: 'Available from' },
      ],
    },
    {
      name: 'emptyStateMessage',
      type: 'textarea',
      localized: true,
      defaultValue:
        "We don't have homes matching your filters right now. Try adjusting them, or make an enquiry and we'll keep you posted.",
    },
  ],
}
