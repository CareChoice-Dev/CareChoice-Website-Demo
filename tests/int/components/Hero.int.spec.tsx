import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Hero } from '@/components/blocks/Hero'

describe('Hero', () => {
  it('renders title in heading', () => {
    render(<Hero title="Live the life you choose." lead="We'll be there." />)
    expect(screen.getByRole('heading', { name: 'Live the life you choose.' })).toBeDefined()
  })

  it('renders lead paragraph', () => {
    render(<Hero title="A." lead="B body." />)
    expect(screen.getByText('B body.')).toBeDefined()
  })

  it('renders ctas', () => {
    render(
      <Hero
        title="t."
        lead="l."
        ctas={[
          { label: 'One.', href: '/one' },
          { label: 'Two.', href: '/two' },
        ]}
      />,
    )
    expect(screen.getByRole('link', { name: /One/ })).toBeDefined()
    expect(screen.getByRole('link', { name: /Two/ })).toBeDefined()
  })
})
