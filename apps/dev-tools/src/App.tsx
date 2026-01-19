"use client"
import { Toaster } from "@devtools/ui/Sonner"
import { Suspense } from "react"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import { LazyLoad } from "./components/LazyLoadComponent"
import BackToTop from "./layouts/BackToTop"
import NavBar from "./layouts/NavBar"
import router from "./routes/router"
import "./App.css"

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Suspense fallback={<div>Loading...</div>}>
          <NavBar />
          <div className="flex flex-col min-h-[calc(100%-44px)]">
            <Routes>
              {router.map(({ to, component, name, title }) => (
                <Route key={name + to + title} path={to} element={<LazyLoad component={component} />} />
              ))}
              <Route path="*" element={<Navigate to="/not-found" replace />} />
            </Routes>
          </div>
        </Suspense>
      </BrowserRouter>
      <BackToTop />
    </>
  )
}

export default App
