import { cache } from 'react'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { PayloadLocale } from './locale'

export const getPayloadClient = cache(async () => {
  return getPayload({ config })
})

export const findOnePageBySlug = cache(
  async (slug: string, locale: PayloadLocale) => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'pages',
      where: { slug: { equals: slug } },
      locale,
      fallbackLocale: 'en',
      limit: 1,
    })
    return result.docs[0] ?? null
  },
)

export const findOneServiceBySlug = cache(
  async (slug: string, locale: PayloadLocale) => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'services',
      where: { slug: { equals: slug } },
      locale,
      fallbackLocale: 'en',
      limit: 1,
    })
    return result.docs[0] ?? null
  },
)

export const findOneCaseStudyBySlug = cache(
  async (slug: string, locale: PayloadLocale) => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'case-studies',
      where: { slug: { equals: slug } },
      locale,
      fallbackLocale: 'en',
      limit: 1,
    })
    return result.docs[0] ?? null
  },
)

export const findOneNewsBySlug = cache(
  async (slug: string, locale: PayloadLocale) => {
    const payload = await getPayloadClient()
    const result = await payload.find({
      collection: 'news',
      where: { slug: { equals: slug } },
      locale,
      fallbackLocale: 'en',
      limit: 1,
    })
    return result.docs[0] ?? null
  },
)

export const listServices = cache(async (locale: PayloadLocale) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'services',
    locale,
    fallbackLocale: 'en',
    limit: 50,
  })
  return result.docs
})

export const listCaseStudies = cache(async (locale: PayloadLocale) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'case-studies',
    locale,
    fallbackLocale: 'en',
    limit: 50,
  })
  return result.docs
})

export const listNews = cache(async (locale: PayloadLocale) => {
  const payload = await getPayloadClient()
  const result = await payload.find({
    collection: 'news',
    locale,
    fallbackLocale: 'en',
    sort: '-publishDate',
    limit: 20,
  })
  return result.docs
})
