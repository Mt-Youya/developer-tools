import { describe, it, expect } from 'vitest'
import { render, screen } from '@testing-library/react'
import { Input } from './input'

describe('Input', () => {
  it('renders correctly', () => {
    // Input 是 void 元素，不能有 children
    render(<Input placeholder="Test input" />)
    expect(screen.getByPlaceholderText('Test input')).toBeInTheDocument()
  })

  it('handles value changes', () => {
    const { container } = render(<Input value="test" readOnly />)
    const input = container.querySelector('input')
    expect(input).toHaveValue('test')
  })

  it('can be disabled', () => {
    render(<Input disabled placeholder="Disabled" />)
    expect(screen.getByPlaceholderText('Disabled')).toBeDisabled()
  })
})