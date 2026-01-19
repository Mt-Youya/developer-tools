import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Tabs } from "./tabs"

describe("Tabs", () => {
  it("renders correctly", () => {
    render(<Tabs>Test</Tabs>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
