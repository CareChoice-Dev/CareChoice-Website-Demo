import type { CollectionConfig } from 'payload'

export const StaffProfiles: CollectionConfig = {
  slug: 'staff-profiles',
  admin: { useAsTitle: 'name' },
  access: { read: () => true },
  fields: [
    { name: 'name',  type: 'text', required: true },
    { name: 'role',  type: 'text', required: true },
    { name: 'bio',   type: 'textarea' },
    { name: 'photo', type: 'upload', relationTo: 'media' },
    {
      name: 'specialties',
      type: 'select',
      hasMany: true,
      options: [
        { label: 'SIL',                value: 'sil' },
        { label: 'Respite',            value: 'respite' },
        { label: 'Community Access',   value: 'community-access' },
        { label: 'Positive Behaviour', value: 'pbs' },
        { label: 'Complex Care',       value: 'complex-care' },
      ],
    },
  ],
}
