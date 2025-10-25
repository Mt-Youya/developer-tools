import { StrictMode } from "react"
import { createRoot } from "react-dom/client"
import "@devtools/ui/style.css"
import "./index.css"
import "./utils/idleCallback"
import App from "./App.tsx"

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <App />
  </StrictMode>
)
