import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest'
import { render, screen, cleanup, fireEvent } from '@testing-library/react'

// next/navigation is used by AskCC.tsx; usePathname must be stubbed.
vi.mock('next/navigation', () => ({
  usePathname: () => '/en',
  useRouter: () => ({ push: vi.fn() }),
}))

import { AskCC } from '@/components/ask/AskCC'
import { AskCCTrigger } from '@/components/ask/AskCCTrigger'
import { useAskStore } from '@/components/ask/ask-store'

function resetStore() {
  useAskStore.setState({
    open: false,
    thread: [],
    demoAfterHours: false,
    pendingInput: '',
    _fetchVacancies: undefined,
  })
}

describe('AskCC smoke render', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStore()
  })
  afterEach(() => cleanup())

  it('renders the dialog with aria attributes', () => {
    const { container } = render(<AskCC />)
    const dialog = container.querySelector('aside[role="dialog"]')
    expect(dialog).not.toBeNull()
    // Non-modal — desktop pushes content rather than blocking it.
    expect(dialog!.getAttribute('aria-modal')).toBeNull()
    expect(dialog!.getAttribute('aria-label')).toBe('Ask CareChoice')
  })

  it('starts closed (aria-hidden=true)', () => {
    const { container } = render(<AskCC />)
    const dialog = container.querySelector('aside[role="dialog"]')
    expect(dialog!.getAttribute('aria-hidden')).toBe('true')
  })

  it('openPanel() makes the dialog visible (aria-hidden=false)', async () => {
    const { container } = render(<AskCC />)
    useAskStore.getState().openPanel()
    // Allow React to flush the state update
    await new Promise((r) => setTimeout(r, 0))
    const dialog = container.querySelector('aside[role="dialog"]')
    expect(dialog!.getAttribute('aria-hidden')).toBe('false')
  })

  it('renders Powered by Agentforce micro-label', () => {
    render(<AskCC />)
    expect(screen.getByText(/Powered by/i)).toBeDefined()
    expect(screen.getByText(/Agentforce/i)).toBeDefined()
  })

  it('shows the empty-state greeting and the quick-start chips when thread is empty', () => {
    render(<AskCC />)
    expect(screen.getByText(/CareChoice Assistant/i)).toBeDefined()
    expect(screen.getByText(/Show me available SIL homes/i)).toBeDefined()
    expect(screen.getByText(/What services do you offer\?/i)).toBeDefined()
    expect(screen.getByText(/Make an enquiry/i)).toBeDefined()
  })

  it('Escape key closes the dialog', async () => {
    render(<AskCC />)
    useAskStore.getState().openPanel()
    // Allow React to flush so the Esc keydown effect attaches
    await new Promise((r) => setTimeout(r, 0))
    fireEvent.keyDown(window, { key: 'Escape' })
    expect(useAskStore.getState().open).toBe(false)
  })

  it('Cmd+K toggles the dialog', async () => {
    render(<AskCC />)
    // Allow the keydown effect to attach
    await new Promise((r) => setTimeout(r, 0))
    expect(useAskStore.getState().open).toBe(false)
    fireEvent.keyDown(window, { key: 'k', metaKey: true })
    expect(useAskStore.getState().open).toBe(true)
  })
})

describe('AskCCTrigger', () => {
  beforeEach(() => {
    localStorage.clear()
    resetStore()
  })
  afterEach(() => cleanup())

  it('floating variant renders a button that opens the panel on click', () => {
    render(<AskCCTrigger variant="floating" />)
    const btn = screen.getByRole('button', { name: /Open Ask CareChoice/i })
    fireEvent.click(btn)
    expect(useAskStore.getState().open).toBe(true)
  })

  it('header-icon variant renders a button and opens the panel', () => {
    render(<AskCCTrigger variant="header-icon" />)
    const btn = screen.getByRole('button', { name: /Open Ask CareChoice/i })
    fireEvent.click(btn)
    expect(useAskStore.getState().open).toBe(true)
  })

  it('hero variant renders an input and the 3 chip suggestions', () => {
    render(<AskCCTrigger variant="hero" />)
    expect(screen.getByLabelText(/Ask CareChoice anything/i)).toBeDefined()
    expect(screen.getAllByText(/Show me available SIL homes/i).length).toBeGreaterThan(0)
  })

  it('hero variant — focusing the input opens the panel', () => {
    render(<AskCCTrigger variant="hero" />)
    const input = screen.getByLabelText(/Ask CareChoice anything/i)
    fireEvent.focus(input)
    expect(useAskStore.getState().open).toBe(true)
  })
})
