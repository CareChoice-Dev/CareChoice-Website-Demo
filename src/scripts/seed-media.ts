/**
 * Bulk photo intake.
 *
 * Usage:
 *   npm run seed-media -- <directory> [--credit "Photographer name"]
 *
 * Walks the directory, uploads each image into Payload Media with placeholder
 * alt text. The user then opens /admin → Media and fills real alt text
 * (REQUIRED for accessibility — the collection enforces it).
 */

import { readdirSync, statSync, readFileSync } from 'fs'
import { join, extname, basename } from 'path'
import { getPayload } from 'payload'
import config from '../payload.config'
import 'dotenv/config'

const IMAGE_EXTS = ['.jpg', '.jpeg', '.png', '.webp', '.gif']

function listImages(dir: string): string[] {
  return readdirSync(dir)
    .map((name) => join(dir, name))
    .filter((path) => statSync(path).isFile())
    .filter((path) => IMAGE_EXTS.includes(extname(path).toLowerCase()))
}

function mimeFor(path: string): string {
  const ext = extname(path).toLowerCase()
  if (ext === '.png') return 'image/png'
  if (ext === '.webp') return 'image/webp'
  if (ext === '.gif') return 'image/gif'
  return 'image/jpeg'
}

async function main() {
  const dir = process.argv[2]
  if (!dir) {
    console.error('Usage: npm run seed-media -- <directory> [--credit "Name"]')
    process.exit(1)
  }

  const creditIdx = process.argv.indexOf('--credit')
  const credit = creditIdx !== -1 ? process.argv[creditIdx + 1] : undefined

  const files = listImages(dir)
  if (files.length === 0) {
    console.log('No images found.')
    process.exit(0)
  }

  console.log(`Uploading ${files.length} images from ${dir}...`)

  const payload = await getPayload({ config })

  for (const path of files) {
    const filename = basename(path)
    const buffer = readFileSync(path)
    const placeholderAlt = `TODO — describe ${filename}`

    await payload.create({
      collection: 'media',
      data: {
        alt: placeholderAlt,
        credit: credit ?? undefined,
        isDecorative: false,
      },
      file: {
        data: buffer,
        mimetype: mimeFor(path),
        name: filename,
        size: buffer.length,
      },
    })

    console.log(`  ✓ ${filename}`)
  }

  console.log()
  console.log(`Uploaded ${files.length} images. Open /admin → Media → fill real alt text for each.`)
  console.log(`Records with alt starting with "TODO" need attention. Search admin for "TODO" to find them.`)
  process.exit(0)
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})
