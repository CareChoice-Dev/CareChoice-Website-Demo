import type { CollectionConfig } from 'payload'

export const SDAPhotos: CollectionConfig = {
  slug: 'sda-photos',
  admin: {
    useAsTitle: 'siteName',
    defaultColumns: ['siteName', 'isHero', 'displayOrder', 'updatedAt'],
    group: 'SDA',
  },
  access: { read: () => true },
  versions: { drafts: { autosave: false } },
  fields: [
    {
      name: 'siteId',
      label: 'Salesforce Site',
      type: 'text',
      required: true,
      admin: {
        description:
          'Pick a site from Salesforce. The ID is stored; the name is denormalised for display.',
        components: {
          Field: 'src/collections/SDAPhotoSitePickerField#SDAPhotoSitePickerField',
        },
      },
    },
    {
      name: 'siteName',
      label: 'Site name (auto-filled)',
      type: 'text',
      admin: {
        readOnly: true,
        description: 'Auto-filled by the Site picker when you choose a site.',
      },
    },
    {
      name: 'media',
      label: 'Photo',
      type: 'upload',
      relationTo: 'media',
      required: true,
      admin: {
        description:
          'Upload the photo to the Media collection. Alt text is required there.',
      },
    },
    {
      name: 'isHero',
      label: 'Use as hero photo',
      type: 'checkbox',
      defaultValue: false,
      admin: {
        description:
          'Tick to use this as the main hero image for the site. Only the first hero per site is shown.',
      },
    },
    {
      name: 'displayOrder',
      label: 'Display order',
      type: 'number',
      defaultValue: 0,
      admin: {
        description: 'Lower numbers appear first. Hero photo overrides order.',
      },
    },
  ],
}
