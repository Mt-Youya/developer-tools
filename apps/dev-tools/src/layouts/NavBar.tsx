import { IS_DEV } from '@devtools/libs'
import type { PropsWithChildren } from 'react'
import { Link } from 'react-router'

function NavBar({ children }: PropsWithChildren) {
  const navClass = 'text-xs font-medium text-gray-800 hover:text-gray-600 transition-colors whitespace-nowrap'
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
              <Link className={navClass} to="/">
                Back Home
              </Link>
              <Link className={navClass} to="/contrast-json">
                前往 JSON 对比
              </Link>
              {IS_DEV && (
                <Link className={navClass} to="/bogo">
                  喜加一
                </Link>
              )}
              <Link className={navClass} to="/qr-code-generator">
                生成二维码
              </Link>
              <Link className={navClass} to="/coding">
                coding
              </Link>
              <Link className={navClass} to="/audio-extractor">
                AudioExtractor
              </Link>
              <Link className={navClass} to="/music-player">
                Music Player
              </Link>
              {/* {navItems.map(item => (
                <a
                  key={item}
                  href={`#${item.toLowerCase()}`}
                  className="text-xs font-medium text-gray-800 hover:text-gray-600 transition-colors whitespace-nowrap"
                >
                  {item}
                </a>
              ))} */}
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
