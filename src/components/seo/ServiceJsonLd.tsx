/**
 * Per-service structured data (schema.org JSON-LD).
 *
 * Emits a `Service` node (provider = CareChoice Organization, audience = people
 * with disability, areaServed = AU) and, when the service has FAQs, a separate
 * `FAQPage` node so the questions are eligible for Google's FAQ rich result.
 */

const SITE_URL = 'https://care-choice-website-demo.vercel.app'

export interface ServiceJsonLdProps {
  title: string
  description?: string
  url: string
  serviceType?: string
  faq?: Array<{ question: string; answer: string }>
}

export function ServiceJsonLd({ title, description, url, serviceType, faq }: ServiceJsonLdProps) {
  const service: Record<string, unknown> = {
    '@context': 'https://schema.org',
    '@type': 'Service',
    name: title,
    url: `${SITE_URL}${url}`,
    provider: {
      '@type': 'Organization',
      name: 'CareChoice',
      url: SITE_URL,
    },
    areaServed: { '@type': 'Country', name: 'Australia' },
    audience: {
      '@type': 'Audience',
      audienceType: 'People with disability and their families',
    },
  }
  if (description) service.description = description
  if (serviceType) service.serviceType = serviceType

  const faqPage =
    faq && faq.length > 0
      ? {
          '@context': 'https://schema.org',
          '@type': 'FAQPage',
          mainEntity: faq.map((q) => ({
            '@type': 'Question',
            name: q.question,
            acceptedAnswer: { '@type': 'Answer', text: q.answer },
          })),
        }
      : null

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(service) }}
      />
      {faqPage && (
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(faqPage) }}
        />
      )}
    </>
  )
}
