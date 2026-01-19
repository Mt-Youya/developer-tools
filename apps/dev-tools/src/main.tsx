import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "./index.css"
import "./utils/idleCallback"
import App from "./App.tsx"

createRoot(document.getElementById("root") as HTMLDivElement).render(
  <StrictMode>
    <App />
  </StrictMode>
)
