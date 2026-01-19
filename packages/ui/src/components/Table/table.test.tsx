import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Table } from "./table"

describe("Table", () => {
  it("renders correctly", () => {
    render(<Table>Test</Table>)
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  // TODO: 添加更多测试用例
})
