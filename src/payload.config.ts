import { postgresAdapter } from '@payloadcms/db-postgres'
import { lexicalEditor } from '@payloadcms/richtext-lexical'
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
import { Navigation } from './globals/Navigation'

const filename = fileURLToPath(import.meta.url)
const dirname = path.dirname(filename)

export default buildConfig({
  admin: {
    user: Users.slug,
    importMap: {
      baseDir: path.resolve(dirname),
    },
  },
  collections: [Users, Media, Pages, Services, CaseStudies, News, StaffProfiles, AudiencePathways, JobListings],
  globals: [Navigation],
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
  plugins: [],
})
