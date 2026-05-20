import { ServiceCard } from './ServiceCard'
import { getPayload } from 'payload'
import config from '@payload-config'
import type { PayloadLocale } from '@/lib/locale'

export async function ServiceCardGrid({ locale, limit = 6 }: { locale: PayloadLocale; limit?: number }) {
  const payload = await getPayload({ config })
  const result = await payload.find({
    collection: 'services',
    locale,
    fallbackLocale: 'en',
    limit,
  })
  const services = result.docs

  if (services.length === 0) {
    return <p className="text-base text-cc-fg-muted">Services will appear here once published.</p>
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {services.map((s) => (
        <ServiceCard
          key={String(s.id)}
          title={s.title as string}
          href={`/services/${s.slug as string}`}
          category={s.category as string}
          intro={s.intro as string}
          fundingTypes={(s.fundingTypes as string[]) ?? []}
        />
      ))}
    </div>
  )
}
