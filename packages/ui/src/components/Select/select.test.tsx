import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Select } from "./select"

describe("Select", () => {
  it("renders correctly", () => {
    render(<Select>Test</Select>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
