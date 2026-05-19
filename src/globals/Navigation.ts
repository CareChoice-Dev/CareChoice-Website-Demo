import type { GlobalConfig } from 'payload'

export const Navigation: GlobalConfig = {
  slug: 'navigation',
  access: { read: () => true },
  fields: [
    {
      name: 'topNav',
      type: 'array',
      localized: true,
      fields: [
        { name: 'label', type: 'text', required: true },
        { name: 'url',   type: 'text', required: true },
        {
          name: 'highlightAsCta',
          type: 'checkbox',
          defaultValue: false,
          admin: { description: 'Render as primary button (e.g. "Make an enquiry.").' },
        },
      ],
    },
    {
      name: 'footerColumns',
      type: 'array',
      localized: true,
      fields: [
        { name: 'heading', type: 'text', required: true },
        {
          name: 'links',
          type: 'array',
          fields: [
            { name: 'label', type: 'text', required: true },
            { name: 'url',   type: 'text', required: true },
          ],
        },
      ],
    },
    {
      name: 'acknowledgementOfCountry',
      type: 'textarea',
      localized: true,
    },
  ],
}
