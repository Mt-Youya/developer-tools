import { Button } from "@devtools/ui/Button"
import { Heart, Home, Library, Music, Plus, Search } from "lucide-react"
import type React from "react"

interface SidebarProps {
  activeView: string
  onViewChange: (view: string) => void
}

export const Sidebar: React.FC<SidebarProps> = ({ activeView, onViewChange }) => {
  const menuItems = [
    { id: "home", label: "Home", icon: Home },
    { id: "search", label: "Search", icon: Search },
    { id: "library", label: "Your Library", icon: Library },
  ]

  const libraryItems = [
    { id: "create", label: "Create Playlist", icon: Plus },
    { id: "liked", label: "Liked Songs", icon: Heart },
    { id: "songs", label: "Your Songs", icon: Music },
  ]

  return (
    <div className="w-64 bg-black text-white h-full flex flex-col">
      {/* Logo */}
      <div className="p-6">
        <h1 className="text-2xl font-bold">Music</h1>
      </div>

      {/* Main Menu */}
      <nav className="flex-1 px-3">
        <ul className="space-y-2">
          {menuItems.map((item) => {
            const Icon = item.icon
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => onViewChange(item.id)}
                  className={`w-full flex items-center space-x-4 px-3 py-2 rounded-lg transition-colors ${
                    activeView === item.id ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
                  }`}
                >
                  <Icon className="w-6 h-6" />
                  <span className="font-semibold">{item.label}</span>
                </button>
              </li>
            )
          })}
        </ul>

        <div className="mt-8">
          <ul className="space-y-2">
            {libraryItems.map((item) => {
              const Icon = item.icon
              return (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => onViewChange(item.id)}
                    className={`w-full flex items-center space-x-4 px-3 py-2 rounded-lg transition-colors ${
                      activeView === item.id ? "bg-gray-800 text-white" : "text-gray-400 hover:text-white"
                    }`}
                  >
                    <Icon className="w-6 h-6" />
                    <span className="font-semibold">{item.label}</span>
                  </button>
                </li>
              )
            })}
          </ul>
        </div>
      </nav>

      {/* Install App */}
      <div className="p-6 border-t border-gray-800">
        <Button variant="ghost" className="w-full justify-start text-gray-400 hover:text-white">
          Install App
        </Button>
      </div>
    </div>
  )
}
