import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Collapsible } from "./collapsible"

describe("Collapsible", () => {
  it("renders correctly", () => {
    render(<Collapsible>Test</Collapsible>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
