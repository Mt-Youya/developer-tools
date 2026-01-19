import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Textarea } from "./textarea"

describe("Textarea", () => {
  it("renders correctly", () => {
    render(<Textarea>Test</Textarea>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
