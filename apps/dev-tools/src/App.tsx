import { Toaster } from "@devtools/ui/Sonner"
import { BrowserRouter, Route, Routes } from "react-router-dom"
import BackToTop from "./layouts/BackToTop"
import NavBar from "./layouts/NavBar"
import AudioExtractor from "./pages/AudioExtractor"
import BOGO from "./pages/BOGO"
import CodeEditor from "./pages/Coding"
import Contrast from "./pages/Contrast"
import Home from "./pages/Home"
import MusicPlayer from "./pages/MusicPlayer"
import QRCodeGenerator from "./pages/QRCodeGenerator"
import NotFound from "./pages/Results/404"
import "./App.css"
import { LazyLoad } from "./components/LazyLoadComponent"

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <NavBar>
          <Routes>
            <Route path="/" element={<LazyLoad component={Home} />} />
            <Route path="/contrast-json" element={<LazyLoad component={Contrast} />} />
            <Route path="/bogo" element={<LazyLoad component={BOGO} />} />
            <Route path="/qr-code-generator" element={<LazyLoad component={QRCodeGenerator} />} />
            <Route path="/coding" element={<LazyLoad component={CodeEditor} />} />
            <Route path="/audio-extractor" element={<LazyLoad component={AudioExtractor} />} />
            <Route path="/music-player" element={<LazyLoad component={MusicPlayer} />} />
            <Route path="/404" element={<LazyLoad component={NotFound} />} />
            <Route path="*" element={<LazyLoad component={NotFound} />} />
          </Routes>
        </NavBar>
      </BrowserRouter>
      <BackToTop />
    </>
  )
}

export default App
