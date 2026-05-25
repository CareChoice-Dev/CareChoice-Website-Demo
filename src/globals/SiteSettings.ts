import type { GlobalConfig } from 'payload'

export const SiteSettings: GlobalConfig = {
  slug: 'site-settings',
  access: { read: () => true },
  fields: [
    { name: 'siteTitle',     type: 'text',   defaultValue: 'CareChoice' },
    { name: 'defaultOgImage', type: 'upload', relationTo: 'media' },
    {
      name: 'phoneNumber',
      type: 'text',
      defaultValue: '1300 737 942',
      admin: { description: 'Australian format with spaces, no parens.' },
    },
    {
      name: 'contactEmail',
      type: 'email',
      defaultValue: 'enquiries@carechoice.com.au',
    },
    {
      name: 'ndisProviderNumber',
      type: 'text',
      admin: {
        description:
          'NDIS provider registration number — surfaces in the footer for compliance. Format e.g. 4050037561 (10 digits, no spaces).',
      },
    },
    {
      name: 'abn',
      type: 'text',
      admin: {
        description: 'Australian Business Number — surfaces in the footer alongside the NDIS provider number.',
      },
    },
    {
      name: 'agentforceDeploymentId',
      type: 'text',
      admin: { description: 'Salesforce Embedded Service Deployment ID (from Cam in week 2).' },
    },
    { name: 'agentforceOrgId', type: 'text' },
  ],
}
