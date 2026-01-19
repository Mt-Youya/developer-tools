import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Label } from "./label"

describe("Label", () => {
  it("renders correctly", () => {
    render(<Label>Test</Label>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
