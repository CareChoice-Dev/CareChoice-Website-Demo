import { describe, it, expect, afterEach, vi } from 'vitest'
import { render, screen, fireEvent, cleanup } from '@testing-library/react'

// Mock next/navigation router so we can capture push() URLs
const pushSpy = vi.fn()
vi.mock('next/navigation', () => ({
  useRouter: () => ({ push: pushSpy }),
}))

import { HelpMeFindAHome } from '@/components/findhome/HelpMeFindAHome'

describe('HelpMeFindAHome', () => {
  afterEach(() => {
    cleanup()
    pushSpy.mockClear()
  })

  it('renders both disclosure steps with the region select and the 3 accessibility checkboxes', () => {
    render(<HelpMeFindAHome hrefPrefix="/en" />)
    expect(screen.getByLabelText(/What region/i)).toBeDefined()
    expect(screen.getByLabelText(/Wheelchair-accessible/i)).toBeDefined()
    expect(screen.getByLabelText(/Robust build/i)).toBeDefined()
    expect(screen.getByLabelText(/Improved liveability/i)).toBeDefined()
  })

  it('updates the region state when the dropdown changes', () => {
    render(<HelpMeFindAHome hrefPrefix="/en" />)
    const select = screen.getByLabelText(/What region/i) as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'Western' } })
    expect(select.value).toBe('Western')
  })

  it('builds a /find-a-home URL with the chosen region and accessibility on submit', () => {
    render(<HelpMeFindAHome hrefPrefix="/en" />)
    const select = screen.getByLabelText(/What region/i) as HTMLSelectElement
    fireEvent.change(select, { target: { value: 'Western' } })

    fireEvent.click(screen.getByLabelText(/Wheelchair-accessible/i))
    fireEvent.click(screen.getByLabelText(/Robust build/i))

    fireEvent.click(screen.getByRole('button', { name: /Show me homes/i }))

    expect(pushSpy).toHaveBeenCalledTimes(1)
    const url = pushSpy.mock.calls[0][0] as string
    expect(url.startsWith('/en/find-a-home?')).toBe(true)
    expect(url).toContain('region=Western')
    // Accessibility tags joined as a single comma-separated query value
    expect(url).toMatch(/accessibility=([^&]*Wheelchair-accessible)/)
    expect(url).toMatch(/accessibility=([^&]*Robust\+build|[^&]*Robust%20build)/)
  })

  it('submits with no params when nothing is selected (navigates to plain /find-a-home)', () => {
    render(<HelpMeFindAHome hrefPrefix="/en" />)
    fireEvent.click(screen.getByRole('button', { name: /Show me homes/i }))
    expect(pushSpy).toHaveBeenCalledTimes(1)
    const url = pushSpy.mock.calls[0][0] as string
    expect(url).toBe('/en/find-a-home')
  })
})
