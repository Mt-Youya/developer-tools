import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Tooltip } from "./tooltip"

describe("Tooltip", () => {
  it("renders correctly", () => {
    render(<Tooltip>Test</Tooltip>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
