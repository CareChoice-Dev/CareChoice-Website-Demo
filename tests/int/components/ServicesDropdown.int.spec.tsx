import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { ServicesDropdown } from '@/components/chrome/ServicesDropdown'

const children = [
  { label: 'Rapid Hospital Discharge', url: '/services/rapid-hospital-discharge' },
  { label: 'Respite Support', url: '/services/respite' },
]

describe('ServicesDropdown', () => {
  afterEach(() => cleanup())

  it('renders the trigger collapsed by default', () => {
    render(
      <ServicesDropdown label="Disability Services" hrefPrefix="/en" children={children} />,
    )
    const trigger = screen.getByRole('button', { name: /Disability Services/ })
    expect(trigger).toBeDefined()
    expect(trigger.getAttribute('aria-expanded')).toBe('false')
  })

  it('opens the panel on click and exposes the child links', () => {
    render(
      <ServicesDropdown label="Disability Services" hrefPrefix="/en" children={children} />,
    )
    const trigger = screen.getByRole('button', { name: /Disability Services/ })
    fireEvent.click(trigger)
    expect(trigger.getAttribute('aria-expanded')).toBe('true')
    expect(screen.getByText('Rapid Hospital Discharge')).toBeDefined()
    expect(screen.getByText('Respite Support')).toBeDefined()
  })

  it('prefixes relative URLs with the locale', () => {
    render(
      <ServicesDropdown label="Disability Services" hrefPrefix="/vi" children={children} />,
    )
    fireEvent.click(screen.getByRole('button', { name: /Disability Services/ }))
    const link = screen.getByRole('menuitem', { name: 'Rapid Hospital Discharge' })
    expect(link.getAttribute('href')).toBe('/vi/services/rapid-hospital-discharge')
  })

  it('renders a "View all" affordance when parentUrl is provided', () => {
    render(
      <ServicesDropdown
        label="Disability Services"
        parentUrl="/services"
        hrefPrefix="/en"
        children={children}
      />,
    )
    fireEvent.click(screen.getByRole('button', { name: /Disability Services/ }))
    expect(screen.getByText(/View all disability services/i)).toBeDefined()
  })
})
