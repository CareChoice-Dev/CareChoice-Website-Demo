import type { CollectionConfig } from 'payload'
import { revalidatePath } from 'next/cache'

export const SDAPhotos: CollectionConfig = {
  slug: 'sda-photos',
  admin: {
    useAsTitle: 'siteName',
    defaultColumns: ['siteName', 'isHero', 'displayOrder', 'updatedAt'],
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
    // Flush the ISR + fetch caches for the affected pages. The pages
    // fetch /api/sda-vacancies and the Data Cache keyed by URL must be
    // invalidated explicitly — revalidatePath on the API route does NOT
    // invalidate fetch caches keyed by that URL elsewhere. Bracketed
    // patterns like `/[locale]/find-a-home/[slug]` are unreliable here,
    // so iterate every locale + use the literal siteId.
    afterChange: [
      ({ doc }) => {
        try {
          revalidatePath('/api/sda-vacancies', 'page')
          for (const locale of ['en', 'vi', 'zh', 'easy-read']) {
            revalidatePath(`/${locale}/find-a-home`, 'page')
            const siteId = (doc as { siteId?: string })?.siteId
            if (siteId) {
              revalidatePath(`/${locale}/find-a-home/${siteId}`, 'page')
            }
          }
        } catch {
          // revalidate* only works inside a Next.js request context;
          // ignore failures from CLI scripts / seed contexts.
        }
      },
    ],
    afterDelete: [
      ({ doc }) => {
        try {
          revalidatePath('/api/sda-vacancies', 'page')
          for (const locale of ['en', 'vi', 'zh', 'easy-read']) {
            revalidatePath(`/${locale}/find-a-home`, 'page')
            const siteId = (doc as { siteId?: string })?.siteId
            if (siteId) {
              revalidatePath(`/${locale}/find-a-home/${siteId}`, 'page')
            }
          }
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
