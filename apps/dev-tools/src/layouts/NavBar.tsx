import type { PropsWithChildren } from "react"
import { Link } from "react-router"

const navItems = [
  { name: "Home", to: "/", title: "Back Home" },
  { name: "Contrast JSON", to: "/contrast-json", title: "前往 JSON 对比" },
  { name: "Bogo", to: "/bogo", title: "喜加一" },
  { name: "QR Code Generator", to: "/qr-code-generator", title: "生成二维码" },
  { name: "Coding", to: "/coding", title: "coding" },
  { name: "Audio Extractor", to: "/audio-extractor", title: "AudioExtractor" },
  { name: "Music Player", to: "/music-player", title: "Music Player" },
]
function NavBar({ children }: PropsWithChildren) {
  const navClass = "text-xs font-medium text-gray-800 hover:text-gray-600 transition-colors whitespace-nowrap"
  return (
    <>
      {/* <img src={logo} alt="logo" className="w-10 h-10" /> */}
      <nav className="sticky top-0 z-10 bg-white/40 backdrop-blur-xl shadow-sm">
        <div className="max-w-7-xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-11">
            <div className="shrink-0">
              <span className="text-xl font-semibold hover:text-gray-600 transition-colors">Developer Tools</span>
            </div>

            <div className="md:flex items-center space-x-8">
              {navItems.map((item) => (
                <Link key={item.name} className={navClass} to={item.to}>
                  {item.title}
                </Link>
              ))}
            </div>

            <div className="flex items-center space-x-4">
              <button className="text-gray-800 hover:text-gray-600 transition-colors"></button>
            </div>
          </div>
        </div>
      </nav>
      {children}
    </>
  )
}

export default NavBar
