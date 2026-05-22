import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, cleanup } from '@testing-library/react'
import { TrustMarks } from '@/components/chrome/TrustMarks'

describe('TrustMarks', () => {
  afterEach(() => cleanup())

  it('renders the eyebrow heading', () => {
    render(<TrustMarks />)
    expect(screen.getByText(/Registered\. Accredited\. Trusted\./)).toBeDefined()
  })

  it('renders all 7 trust mark badges, each with non-empty alt text', () => {
    render(<TrustMarks />)
    const images = screen.getAllByRole('img')
    expect(images.length).toBe(7)
    for (const img of images) {
      const alt = img.getAttribute('alt')
      expect(alt).toBeTruthy()
      expect((alt ?? '').length).toBeGreaterThan(0)
    }
  })

  it('includes badges for the 7 named accreditations', () => {
    render(<TrustMarks />)
    expect(screen.getByAltText(/NDIS Registered Service Provider/i)).toBeDefined()
    expect(screen.getByAltText(/NDIS Mark of Trust/i)).toBeDefined()
    expect(screen.getByAltText(/National Disability Services \(NDS\) Associate/i)).toBeDefined()
    expect(screen.getByAltText(/NDISDA/i)).toBeDefined()
    expect(screen.getByAltText(/Victorian Government/i)).toBeDefined()
    expect(screen.getByAltText(/Australasian Association of Forensic Disability/i)).toBeDefined()
    expect(screen.getByAltText(/TAC and WorkSafe/i)).toBeDefined()
  })
})
