import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { QRCodeCanvas } from "./Canvas"

describe("QRCodeCanvas", () => {
  it("renders correctly", () => {
    const { container } = render(<QRCodeCanvas value="test" />)

    // 检查 Canvas 元素存在
    const canvas = container.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
  })

  it("renders with custom size", () => {
    const { container } = render(<QRCodeCanvas value="test" size={256} />)
    const canvas = container.querySelector("canvas")
    expect(canvas).toHaveAttribute("width", "256")
    expect(canvas).toHaveAttribute("height", "256")
  })

  it("applies custom className", () => {
    const { container } = render(<QRCodeCanvas value="test" className="custom-qr" />)
    const canvas = container.querySelector("canvas")
    expect(canvas).toHaveClass("custom-qr")
  })

  it("renders with error correction level", () => {
    const { container } = render(<QRCodeCanvas value="test" level="H" />)
    const canvas = container.querySelector("canvas")
    expect(canvas).toBeInTheDocument()
  })
})
