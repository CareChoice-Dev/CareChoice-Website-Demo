import type { CollectionConfig } from 'payload'

export const Users: CollectionConfig = {
  slug: 'users',
  auth: true,
  admin: {
    useAsTitle: 'email',
    defaultColumns: ['email', 'role'],
  },
  access: {
    read: () => true,
  },
  fields: [
    {
      name: 'role',
      type: 'select',
      required: true,
      defaultValue: 'editor',
      options: [
        { label: 'Admin (IT)',                 value: 'admin' },
        { label: 'Editor (Marketing)',         value: 'editor' },
        { label: 'Publisher (Marketing lead)', value: 'publisher' },
        { label: 'Translator',                 value: 'translator' },
      ],
    },
    {
      name: 'name',
      type: 'text',
    },
  ],
}
