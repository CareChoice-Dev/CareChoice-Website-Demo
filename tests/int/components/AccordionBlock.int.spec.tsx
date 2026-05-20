import { describe, it, expect, afterEach } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'
import { AccordionBlock } from '@/components/blocks/AccordionBlock'

const items = [
  { id: 'q1', heading: 'What is SIL?', body: <p>SIL stands for Supported Independent Living.</p> },
  { id: 'q2', heading: 'Who is it for?', body: <p>People who want day-to-day help to live independently.</p> },
]

describe('AccordionBlock', () => {
  afterEach(() => cleanup())

  it('renders all headings', () => {
    render(<AccordionBlock items={items} />)
    expect(screen.getByRole('button', { name: /What is SIL/ })).toBeDefined()
    expect(screen.getByRole('button', { name: /Who is it for/ })).toBeDefined()
  })

  it('toggles a panel open on click', () => {
    render(<AccordionBlock items={items} />)
    fireEvent.click(screen.getByRole('button', { name: /What is SIL/ }))
    expect(screen.getByText(/SIL stands for/)).toBeDefined()
  })
})
