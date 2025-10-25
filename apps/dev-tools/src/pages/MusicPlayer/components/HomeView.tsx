import React from 'react'
import { PlaylistCard } from './PlaylistCard'

import { type Playlist } from '@/types/music'

interface HomeViewProps {
  playlists: Playlist[]
  onPlaylistPlay: (playlist: Playlist) => void
}

export const HomeView: React.FC<HomeViewProps> = ({
  playlists,
  onPlaylistPlay,
}) => {
  const timeOfDay = () => {
    const hour = new Date().getHours()
    if (hour < 12) return 'Good morning'
    if (hour < 18) return 'Good afternoon'
    return 'Good evening'
  }

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">{timeOfDay()}</h2>

      {/* Featured Playlists */}
      <section className="mb-12">
        <h3 className="text-2xl font-bold mb-6">Made For You</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlay={onPlaylistPlay}
            />
          ))}
        </div>
      </section>

      {/* Recently Played */}
      <section>
        <h3 className="text-2xl font-bold mb-6">Recently Played</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-6">
          {playlists.slice(0, 3).map((playlist) => (
            <PlaylistCard
              key={playlist.id}
              playlist={playlist}
              onPlay={onPlaylistPlay}
            />
          ))}
        </div>
      </section>
    </div>
  )
}
