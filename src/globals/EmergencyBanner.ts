import type { GlobalConfig } from 'payload'

export const EmergencyBanner: GlobalConfig = {
  slug: 'emergency-banner',
  access: { read: () => true },
  fields: [
    {
      name: 'active',
      type: 'checkbox',
      defaultValue: false,
      admin: { description: 'Toggle on to display the banner site-wide.' },
    },
    { name: 'message', type: 'text', localized: true },
    {
      name: 'severity',
      type: 'select',
      defaultValue: 'info',
      options: [
        { label: 'Info',    value: 'info' },
        { label: 'Warning', value: 'warning' },
        { label: 'Alert',   value: 'alert' },
      ],
    },
    { name: 'linkUrl',   type: 'text' },
    { name: 'linkLabel', type: 'text', localized: true },
  ],
}
