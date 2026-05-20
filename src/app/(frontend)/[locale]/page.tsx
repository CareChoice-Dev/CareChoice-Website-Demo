import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { notFound } from 'next/navigation'

export default async function HomePage({
  params,
}: {
  params: Promise<{ locale: string }>
}) {
  const { locale: urlLocale } = await params
  if (!isUrlSlug(urlLocale)) notFound()
  const locale = urlSlugToLocale(urlLocale)

  return (
    <div style={{ padding: 'var(--space-7, 48px)' }}>
      <h1>CareChoice.</h1>
      <p>Locale: <strong>{locale}</strong>.</p>
      <p>
        Component library demo:{' '}
        <a href={`/${urlLocale}/dev/components`}>/{urlLocale}/dev/components</a>.
      </p>
      <p>
        Live SDA homes:{' '}
        <a href={`/${urlLocale}/find-a-home`}>/{urlLocale}/find-a-home</a>.
      </p>
    </div>
  )
}
