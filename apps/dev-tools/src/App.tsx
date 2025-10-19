import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { Toaster } from "@devtools/sonner";
import { IS_DEV } from "@devtools/libs";
import { devRoutes } from "./routes/devRoutes";
import { LazyLoad } from "./components/LazyLoadComponent";
import Home from "./pages/Home";
import Contrast from "./pages/Contrast";
import NotFound from "./pages/Results/404";
import BackToTop from "./layouts/BackToTop";
import QRCodeGenerator from "./pages/QRCodeGenerator";
import CodeEditor from "./pages/Coding";
import "./App.css";

function App() {
  return (
    <>
      <Toaster richColors position="top-center" />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/contrast-json" element={<Contrast />} />
          <Route path="/qr-code-generator" element={<QRCodeGenerator />} />
          <Route path="/coding" element={<CodeEditor />} />
          <Route path="/404" element={<NotFound />} />
          <Route path="*" element={<NotFound />} />
          {devRoutes.map(route => (
            <Route
              path={route.path}
              element={IS_DEV ? <LazyLoad component={route.component} /> : <Navigate to="/404" />}
            />
          ))}
        </Routes>
      </BrowserRouter>
      <BackToTop />
    </>
  );
}

export default App;
