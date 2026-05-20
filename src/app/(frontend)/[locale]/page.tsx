import { isUrlSlug, urlSlugToLocale } from '@/lib/locale'
import { Link } from '@/components/primitives/Link'
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
        <Link href="/dev/components">/{urlLocale}/dev/components</Link>.
      </p>
      <p>
        Live SDA homes:{' '}
        <Link href="/find-a-home">/{urlLocale}/find-a-home</Link>.
      </p>
    </div>
  )
}
