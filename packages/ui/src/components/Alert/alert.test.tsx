import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Alert } from "./alert"

describe("Alert", () => {
  it("renders correctly", () => {
    render(<Alert>Test</Alert>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
