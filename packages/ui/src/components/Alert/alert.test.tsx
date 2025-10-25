import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, expect, it, vi } from "vitest"
import { Alert } from "./alert"

describe("Alert", () => {
  it("renders correctly", () => {
    render(<Alert>Test</Alert>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
