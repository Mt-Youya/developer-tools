import React from 'react'
import { Play } from 'lucide-react'
import { Button } from '@devtools/ui/Button'

import { type Playlist } from '@/types/music'

interface PlaylistCardProps {
  playlist: Playlist
  onPlay: (playlist: Playlist) => void
}

export const PlaylistCard: React.FC<PlaylistCardProps> = ({ playlist, onPlay }) => {
  return (
    <div className="group relative bg-white dark:bg-gray-900 p-4 rounded-lg hover:bg-gray-50 dark:hover:bg-gray-800 transition-all cursor-pointer">
      <div className="relative mb-4">
        <img
          src={playlist.cover}
          alt={playlist.name}
          className="w-full aspect-square object-cover rounded-lg shadow-lg"
        />
        <Button
          size="icon"
          className="absolute bottom-2 right-2 w-12 h-12 rounded-full opacity-0 group-hover:opacity-100 translate-y-2 group-hover:translate-y-0 transition-all shadow-xl"
          onClick={() => onPlay(playlist)}
        >
          <Play className="w-6 h-6 ml-0.5" />
        </Button>
      </div>
      <h3 className="font-semibold text-lg mb-1 truncate">{playlist.name}</h3>
      <p className="text-sm text-gray-500 line-clamp-2">{playlist.description}</p>
    </div>
  )
}
