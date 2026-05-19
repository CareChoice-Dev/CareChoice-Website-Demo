import { headers } from 'next/headers'
import Link from 'next/link'

export default async function HomePage() {
  const h = await headers()
  const locale = h.get('x-locale') ?? 'en'

  return (
    <main style={{ padding: 'var(--space-7, 48px)' }}>
      <h1>CareChoice demo.</h1>
      <p>
        This is the foundation scaffold for the CareChoice website redesign demo. Locale:{' '}
        <strong>{locale}</strong>. Full design treatment lands in Week 3.
      </p>
      <p>
        Brand tokens are wired. Source Sans 3 should be active. Magenta is{' '}
        <span style={{ color: 'var(--cc-pms-675)', fontWeight: 600 }}>this colour</span>.
      </p>
      <p>
        <Link href="/admin">Go to admin panel →</Link>
      </p>
    </main>
  )
}
