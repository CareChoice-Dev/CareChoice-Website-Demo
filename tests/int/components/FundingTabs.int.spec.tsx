import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { FundingTabs } from '@/components/blocks/FundingTabs'

describe('FundingTabs', () => {
  afterEach(() => cleanup())

  const tabs = [
    { id: 'ndis', label: 'NDIS', content: <p>NDIS body.</p> },
    { id: 'tac', label: 'TAC', content: <p>TAC body.</p> },
  ]

  it('renders first tab content by default', () => {
    render(<FundingTabs tabs={tabs} />)
    expect(screen.getByText('NDIS body.')).toBeDefined()
  })

  it('switches content when a different tab is clicked', () => {
    render(<FundingTabs tabs={tabs} />)
    fireEvent.click(screen.getByRole('tab', { name: 'TAC' }))
    expect(screen.getByText('TAC body.')).toBeDefined()
  })

  it('returns null if no tabs', () => {
    const { container } = render(<FundingTabs tabs={[]} />)
    expect(container.firstChild).toBeNull()
  })
})
