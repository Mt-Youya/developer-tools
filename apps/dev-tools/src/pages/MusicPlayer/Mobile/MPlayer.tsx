import { Button } from "@devtools/ui/Button"
import { ChevronDown, Heart, MoreHorizontal } from "lucide-react"
import type React from "react"

import type { Song } from "@/types/music"

interface MobilePlayerProps {
  song: Song
  onClose: () => void
}

export const MobilePlayer: React.FC<MobilePlayerProps> = ({ song, onClose }) => {
  return (
    <div className="fixed inset-0 bg-gradient-to-b from-purple-900 to-black z-50 p-6 flex flex-col">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <Button variant="ghost" size="icon" onClick={onClose}>
          <ChevronDown className="w-6 h-6" />
        </Button>
        <div className="text-center flex-1">
          <p className="text-sm text-gray-300">Playing from playlist</p>
          <p className="font-semibold">Today's Hits</p>
        </div>
        <Button variant="ghost" size="icon">
          <MoreHorizontal className="w-6 h-6" />
        </Button>
      </div>

      {/* Album Art */}
      <div className="flex-1 flex items-center justify-center mb-8">
        <img src={song.cover} alt={song.title} className="w-full max-w-sm aspect-square rounded-lg shadow-2xl" />
      </div>

      {/* Song Info */}
      <div className="flex items-start justify-between mb-6">
        <div className="flex-1 min-w-0">
          <h2 className="text-2xl font-bold truncate mb-1">{song.title}</h2>
          <p className="text-gray-300">{song.artist}</p>
        </div>
        <Button variant="ghost" size="icon">
          <Heart className="w-6 h-6" />
        </Button>
      </div>
    </div>
  )
}
