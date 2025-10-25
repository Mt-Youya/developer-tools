import type { PropsWithChildren } from "react"
import Instructions from "../pages/Home/components/Instructions"
import Header from "./Header"

function Main({ children }: PropsWithChildren) {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-br from-slate-50 to-slate-100 p-4">
        <div className="max-w-7xl mx-auto space-y-6">
          <Header />
          {children}
          <Instructions />
        </div>
      </div>
    </div>
  )
}

export default Main
