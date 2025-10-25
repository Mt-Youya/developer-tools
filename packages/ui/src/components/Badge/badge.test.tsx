import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Badge } from "./badge"

describe("Badge", () => {
  it("renders correctly", () => {
    render(<Badge>Test</Badge>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
