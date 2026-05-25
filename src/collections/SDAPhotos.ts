import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const SDAPhotos: CollectionConfig = {
  slug: 'sda-photos',
  admin: {
    useAsTitle: 'siteName',
    defaultColumns: ['siteName', 'updatedAt'],
    group: 'SDA',
    // NOTE: Custom Sites Roster list view temporarily unhooked while we debug
    // a runtime admin crash. The component file lives at
    // src/collections/SDASitesView.tsx and its importMap entry remains so the
    // wiring is one edit away from being restored.
    // components: {
    //   views: {
    //     list: {
    //       Component: 'src/collections/SDASitesView#SDASitesView',
    //     },
    //   },
    // },
  },
  access: { read: () => true },
  versions: { drafts: { autosave: false } },
  hooks: {
    // The Site picker writes only `siteId`. We denormalise the site name
    // server-side here so the admin list/title always reflects the current
    // Salesforce name, and so we never depend on sibling-field writes from
    // a custom client component (API stability across Payload 3.x versions).
    beforeChange: [
      async ({ data, req }) => {
        if (!data?.siteId) return data
        try {
          const proto = req.headers.get('x-forwarded-proto') ?? 'http'
          const host = req.headers.get('host') ?? 'localhost:3000'
          const res = await fetch(`${proto}://${host}/api/sda-vacancies`)
          if (res.ok) {
            const sda = (await res.json()) as {
              vacancies: Array<{ id: string; name: string }>
            }
            const match = sda.vacancies.find((v) => v.id === data.siteId)
            if (match) data.siteName = match.name
          }
        } catch {
          // Non-fatal — leave siteName as-is; admins can edit it manually.
        }
        return data
      },
    ],
    // Flush the ISR cache for /api/sda-vacancies and every page that
    // fetches it (find-a-home listing + detail). Without this, edits
    // wait up to `revalidate` seconds (currently 30) before showing.
    afterChange: [
      () => {
        try {
          revalidatePath('/api/sda-vacancies', 'page')
          revalidatePath('/[locale]/find-a-home', 'page')
          revalidatePath('/[locale]/find-a-home/[slug]', 'page')
        } catch {
          // revalidate* only works inside a Next.js request context;
          // ignore failures from CLI scripts / seed contexts.
        }
      },
    ],
    afterDelete: [
      () => {
        try {
          revalidatePath('/api/sda-vacancies', 'page')
          revalidatePath('/[locale]/find-a-home', 'page')
          revalidatePath('/[locale]/find-a-home/[slug]', 'page')
        } catch {
          // see afterChange
        }
      },
    ],
  },
  fields: [
    {
      name: 'siteId',
      label: 'Salesforce Site',
      type: 'text',
      required: true,
      unique: true,
      admin: {
        description:
          'Pick a site from Salesforce. The ID is stored; the name is denormalised for display. One SDAPhotos doc per site — add multiple photos via the Photos array below.',
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
      name: 'photos',
      label: 'Photos',
      labels: { singular: 'Photo', plural: 'Photos' },
      type: 'array',
      required: true,
      minRows: 1,
      admin: {
        description:
          'Bulk-upload photos to the Media collection first, then add a row here per photo. Drag rows to reorder; tick "Hero" on one to mark it as the main image.',
      },
      fields: [
        {
          name: 'media',
          label: 'Photo',
          type: 'upload',
          relationTo: 'media',
          required: true,
        },
        {
          name: 'isHero',
          label: 'Hero',
          type: 'checkbox',
          defaultValue: false,
          admin: {
            description:
              'Tick on the photo to use as the main hero image. Only the first hero is shown.',
            width: '50%',
          },
        },
        {
          name: 'caption',
          label: 'Caption (optional)',
          type: 'text',
          admin: { width: '50%' },
        },
      ],
    },
  ],
}
