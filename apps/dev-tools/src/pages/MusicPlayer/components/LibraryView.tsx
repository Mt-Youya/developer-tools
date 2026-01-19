import type React from "react"
import type { Song } from "@/types/music"
import { SongList } from "./SongList"

interface LibraryViewProps {
  songs: Song[]
  currentSong: Song | null
  isPlaying: boolean
  onSongSelect: (song: Song) => void
  onPlayPause: () => void
}

export const LibraryView: React.FC<LibraryViewProps> = ({
  songs,
  currentSong,
  isPlaying,
  onSongSelect,
  onPlayPause,
}) => {
  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Your Library</h2>

      <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h3 className="text-xl font-semibold">All Songs</h3>
            <p className="text-sm text-gray-500">{songs.length} songs</p>
          </div>
        </div>

        <SongList
          songs={songs}
          currentSong={currentSong}
          isPlaying={isPlaying}
          onSongSelect={onSongSelect}
          onPlayPause={onPlayPause}
        />
      </div>
    </div>
  )
}
