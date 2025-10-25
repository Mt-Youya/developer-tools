import { Button } from "@devtools/ui/Button"
import { formatTime } from "@devtools/utils"
import { MoreHorizontal, Pause, Play } from "lucide-react"
import type React from "react"

import type { Song } from "@/types/music"

interface SongListProps {
  songs: Song[]
  currentSong: Song | null
  isPlaying: boolean
  onSongSelect: (song: Song) => void
  onPlayPause: () => void
}

export const SongList: React.FC<SongListProps> = ({ songs, currentSong, isPlaying, onSongSelect, onPlayPause }) => {
  return (
    <div className="space-y-1">
      {songs.map((song, index) => {
        const isCurrentSong = currentSong?.id === song.id

        return (
          <div
            key={song.id}
            className={`group flex items-center space-x-4 p-3 rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer transition-colors ${
              isCurrentSong ? "bg-gray-100 dark:bg-gray-800" : ""
            }`}
            onClick={() => onSongSelect(song)}
          >
            {/* Index/Play Button */}
            <div className="w-8 flex items-center justify-center">
              {isCurrentSong && isPlaying ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPlayPause()
                  }}
                >
                  <Pause className="w-4 h-4 text-primary" />
                </Button>
              ) : isCurrentSong ? (
                <Button
                  variant="ghost"
                  size="icon"
                  className="w-8 h-8"
                  onClick={(e) => {
                    e.stopPropagation()
                    onPlayPause()
                  }}
                >
                  <Play className="w-4 h-4 text-primary" />
                </Button>
              ) : (
                <>
                  <span className="text-sm text-gray-500 group-hover:hidden">{index + 1}</span>
                  <Play className="w-4 h-4 hidden group-hover:block" />
                </>
              )}
            </div>

            {/* Album Cover */}
            <img src={song.cover} alt={song.title} className="w-12 h-12 rounded object-cover" />

            {/* Song Info */}
            <div className="flex-1 min-w-0">
              <h4 className={`font-medium truncate ${isCurrentSong ? "text-primary" : ""}`}>{song.title}</h4>
              <p className="text-sm text-gray-500 truncate">{song.artist}</p>
            </div>

            {/* Album */}
            <div className="hidden md:block flex-1 min-w-0">
              <p className="text-sm text-gray-500 truncate">{song.album}</p>
            </div>

            {/* Duration */}
            <div className="flex items-center space-x-4">
              <span className="text-sm text-gray-500">{formatTime(song.duration)}</span>
              <Button
                variant="ghost"
                size="icon"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={(e) => e.stopPropagation()}
              >
                <MoreHorizontal className="w-5 h-5" />
              </Button>
            </div>
          </div>
        )
      })}
    </div>
  )
}
