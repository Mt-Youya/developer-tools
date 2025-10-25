import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Collapsible } from "./collapsible"

describe("Collapsible", () => {
  it("renders correctly", () => {
    render(<Collapsible>Test</Collapsible>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
