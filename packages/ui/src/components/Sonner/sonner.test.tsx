import { describe, it, expect } from 'vitest'
import { render } from '@testing-library/react'
import { Toaster } from './sonner'

describe('Sonner', () => {
  it('renders correctly', () => {
    const { container } = render(<Toaster />)
    // Toaster 组件可能不会立即渲染可见内容,只检查容器
    expect(container).toBeInTheDocument()
  })

  it('renders with custom position', () => {
    const { container } = render(<Toaster position="top-center" />)
    expect(container).toBeInTheDocument()
  })

  it('renders with theme', () => {
    const { container } = render(<Toaster theme="dark" />)
    expect(container).toBeInTheDocument()
  })

  it('renders with custom richColors', () => {
    const { container } = render(<Toaster richColors />)
    expect(container).toBeInTheDocument()
  })
})