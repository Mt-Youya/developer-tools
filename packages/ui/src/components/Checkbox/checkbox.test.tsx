import { render, screen } from "@testing-library/react"
import { describe, expect, it } from "vitest"
import { Checkbox } from "./checkbox"

describe("Checkbox", () => {
  it("renders correctly", () => {
    // Checkbox 本身不显示文本，需要配合 Label 使用
    render(
      <div>
        <Checkbox id="test" />
        <label htmlFor="test">Test</label>
      </div>
    )
    expect(screen.getByRole("checkbox")).toBeInTheDocument()
    expect(screen.getByText("Test")).toBeInTheDocument()
  })

  it("can be checked", () => {
    render(<Checkbox defaultChecked />)
    expect(screen.getByRole("checkbox")).toHaveAttribute("aria-checked", "true")
  })

  it("can be disabled", () => {
    render(<Checkbox disabled />)
    expect(screen.getByRole("checkbox")).toBeDisabled()
  })
})
