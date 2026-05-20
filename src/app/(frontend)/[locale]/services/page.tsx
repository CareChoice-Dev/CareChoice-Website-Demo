import { notFound } from 'next/navigation'
import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { listServices } from '@/lib/payload-client'
import { ServiceCard } from '@/components/blocks/ServiceCard'

export default async function ServicesIndex({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)
  const services = await listServices(locale)

  return (
    <div className="max-w-[1280px] mx-auto px-6 md:px-8 py-10 flex flex-col gap-8">
      <h1 className="text-4xl md:text-6xl font-bold leading-tight tracking-tight">Our services.</h1>
      {services.length === 0 ? (
        <p className="text-lg">Services will appear here once content is published in the admin.</p>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
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
      )}
    </div>
  )
}
