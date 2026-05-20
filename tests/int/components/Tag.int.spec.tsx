import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Tag } from '@/components/primitives/Tag'

describe('Tag', () => {
  it('renders children', () => {
    render(<Tag>NDIS</Tag>)
    expect(screen.getByText('NDIS')).toBeDefined()
  })

  it.each([
    ['solid', 'bg-cc-magenta'],
    ['soft', 'bg-cc-magenta-60'],
    ['outline', 'border-cc-black'],
    ['pink', 'bg-cc-surface-pink'],
  ] as const)('applies %s variant', (variant, expectedClass) => {
    const { container } = render(<Tag variant={variant}>x</Tag>)
    expect((container.firstChild as HTMLElement).className).toContain(expectedClass)
  })
})
