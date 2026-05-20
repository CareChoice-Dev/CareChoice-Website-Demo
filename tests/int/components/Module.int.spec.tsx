import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Module } from '@/components/primitives/Module'

describe('Module', () => {
  it('renders children', () => {
    render(<Module>Hello.</Module>)
    expect(screen.getByText('Hello.')).toBeDefined()
  })

  it('applies default 7px border', () => {
    const { container } = render(<Module>x</Module>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('border-[7px]')
  })

  it('applies 4px border for card weight', () => {
    const { container } = render(<Module weight="card">x</Module>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('border-4')
  })

  it('applies magenta fill', () => {
    const { container } = render(<Module fill="magenta">x</Module>)
    const el = container.firstChild as HTMLElement
    expect(el.className).toContain('bg-cc-magenta')
    expect(el.className).toContain('text-white')
  })
})
