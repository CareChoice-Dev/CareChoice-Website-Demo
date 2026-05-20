import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Button } from '@/components/primitives/Button'

describe('Button', () => {
  it('renders a button by default', () => {
    render(<Button>Click.</Button>)
    expect(screen.getByRole('button', { name: 'Click.' })).toBeDefined()
  })

  it('renders an anchor when href is provided', () => {
    render(<Button href="/foo">Go.</Button>)
    const el = screen.getByRole('link', { name: 'Go.' })
    expect(el.getAttribute('href')).toBe('/foo')
  })

  it('applies primary variant classes by default', () => {
    const { container } = render(<Button>x</Button>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('bg-cc-magenta')
    expect(el.className).toContain('text-white')
  })

  it('applies secondary variant', () => {
    const { container } = render(<Button variant="secondary">x</Button>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('bg-white')
    expect(el.className).toContain('text-cc-black')
  })

  it('applies ghost variant', () => {
    const { container } = render(<Button variant="ghost">x</Button>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('border-transparent')
  })
})
