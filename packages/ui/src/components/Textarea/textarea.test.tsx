import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Textarea } from "./textarea"

describe("Textarea", () => {
  it("renders correctly", () => {
    render(<Textarea>Test</Textarea>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
