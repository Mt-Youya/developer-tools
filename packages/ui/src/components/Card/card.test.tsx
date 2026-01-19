import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Card } from "./card"

describe("Card", () => {
  it("renders correctly", () => {
    render(<Card>Test</Card>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
