import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Tag } from "./tag"

describe("Tabs", () => {
  it("renders correctly", () => {
    render(<Tag>Test</Tag>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
