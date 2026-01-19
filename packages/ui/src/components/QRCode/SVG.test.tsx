import { render } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { QRCodeSVG } from "./SVG"

describe("QRCodeSVG", () => {
  it("renders correctly", () => {
    // QRCodeSVG 只渲染二维码图像,不接受文本 children
    const { container } = render(<QRCodeSVG value="test" />)

    // 检查 SVG 元素存在
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
    expect(svg).toHaveAttribute("role", "img")
  })

  it("renders with custom size", () => {
    const { container } = render(<QRCodeSVG value="test" size={256} />)
    const svg = container.querySelector("svg")
    expect(svg).toHaveAttribute("width", "256")
    expect(svg).toHaveAttribute("height", "256")
  })

  it("renders with custom colors", () => {
    const { container } = render(<QRCodeSVG value="test" fgColor="#000000" bgColor="#FFFFFF" />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })

  it("includes margin when specified", () => {
    const { container } = render(<QRCodeSVG value="test" includeMargin />)
    const svg = container.querySelector("svg")
    expect(svg).toBeInTheDocument()
  })
})
