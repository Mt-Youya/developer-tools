import { type RenderOptions, render } from "@testing-library/react"
import type { ReactElement } from "react"

// 自定义 render 函数，可以添加通用的 Provider
const customRender = (ui: ReactElement, options?: Omit<RenderOptions, "wrapper">) => render(ui, { ...options })

export * from "@testing-library/react"
export { customRender as render }
