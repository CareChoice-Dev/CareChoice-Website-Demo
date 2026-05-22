import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
import { vercelBlobStorage } from '@payloadcms/storage-vercel-blob'
import path from 'path'
import { buildConfig } from 'payload'
import { fileURLToPath } from 'url'
import sharp from 'sharp'

import { Users } from './collections/Users'
import { Media } from './collections/Media'
import { Pages } from './collections/Pages'
import { Services } from './collections/Services'
import { CaseStudies } from './collections/CaseStudies'
import { News } from './collections/News'
import { StaffProfiles } from './collections/StaffProfiles'
import { AudiencePathways } from './collections/AudiencePathways'
import { JobListings } from './collections/JobListings'
import { SDAPhotos } from './collections/SDAPhotos'
import { Navigation } from './globals/Navigation'
import { SiteSettings } from './globals/SiteSettings'
import { SDAHomesPage } from './globals/SDAHomesPage'
import { EmergencyBanner } from './globals/EmergencyBanner'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Services, CaseStudies, News, StaffProfiles, AudiencePathways, JobListings, SDAPhotos],
  globals: [Navigation, SiteSettings, SDAHomesPage, EmergencyBanner],
  localization: {
    locales: [
      { label: 'English',               code: 'en' },
      { label: 'English (Easy Read)',   code: 'en-easy-read' },
      { label: 'Vietnamese',            code: 'vi' },
      { label: 'Mandarin (Simplified)', code: 'zh' },
    ],
    defaultLocale: 'en',
    fallback: true,
  },
  editor: lexicalEditor(),
  secret: process.env.PAYLOAD_SECRET || '',
  typescript: {
    outputFile: path.resolve(dirname, 'payload-types.ts'),
  },
  db: postgresAdapter({
    pool: {
      connectionString: process.env.DATABASE_URL || '',
    },
  }),
  sharp,
  plugins: [
    // Vercel Blob storage adapter — required because Vercel's filesystem is read-only.
    // When BLOB_READ_WRITE_TOKEN is unset (local dev), enabled:false falls back to
    // the Media collection's `staticDir` write-to-filesystem behaviour.
    vercelBlobStorage({
      enabled: Boolean(process.env.BLOB_READ_WRITE_TOKEN),
      collections: {
        media: true,
      },
      token: process.env.BLOB_READ_WRITE_TOKEN,
    }),
  ],
})
