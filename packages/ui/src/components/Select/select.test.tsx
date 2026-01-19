import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Select } from "./select"

describe("Select", () => {
  it("renders correctly", () => {
    render(<Select>Test</Select>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
