import React, { useState } from 'react'
import { Search } from 'lucide-react'
import { SongList } from './SongList'

import { type Song } from '@/types/music'

interface SearchViewProps {
  songs: Song[]
  currentSong: Song | null
  isPlaying: boolean
  onSongSelect: (song: Song) => void
  onPlayPause: () => void
}

export default function SearchView({ songs, currentSong, isPlaying, onSongSelect, onPlayPause }: SearchViewProps) {
  const [searchQuery, setSearchQuery] = useState('')

  const filteredSongs = songs.filter(
    song =>
      song.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.artist.toLowerCase().includes(searchQuery.toLowerCase()) ||
      song.album.toLowerCase().includes(searchQuery.toLowerCase()),
  )

  const genres = Array.from(new Set(songs.map(song => song.genre)))

  return (
    <div className="p-8">
      <h2 className="text-3xl font-bold mb-8">Search</h2>

      {/* Search Input */}
      <div className="relative mb-8">
        <Search className="absolute left-4 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
        <input
          type="text"
          placeholder="What do you want to listen to?"
          value={searchQuery}
          onChange={e => setSearchQuery(e.target.value)}
          className="w-full pl-12 pr-4 py-3 bg-white dark:bg-gray-800 rounded-full border border-gray-200 dark:border-gray-700 focus:outline-none focus:ring-2 focus:ring-primary"
        />
      </div>

      {!searchQuery ? (
        <>
          {/* Browse Genres */}
          <section>
            <h3 className="text-2xl font-bold mb-6">Browse All</h3>
            <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
              {genres.map((genre, index) => (
                <div
                  key={genre}
                  className="relative h-32 rounded-lg overflow-hidden cursor-pointer hover:scale-105 transition-transform"
                  style={{
                    background: `linear-gradient(135deg, ${
                      ['#e91e63', '#9c27b0', '#3f51b5', '#00bcd4', '#4caf50', '#ff9800'][index % 6]
                    }, ${['#c2185b', '#7b1fa2', '#303f9f', '#0097a7', '#388e3c', '#f57c00'][index % 6]})`,
                  }}
                >
                  <h4 className="absolute bottom-4 left-4 text-white font-bold text-xl">{genre}</h4>
                </div>
              ))}
            </div>
          </section>
        </>
      ) : (
        <>
          {/* Search Results */}
          <section>
            <h3 className="text-xl font-semibold mb-4">
              {filteredSongs.length > 0
                ? `Found ${filteredSongs.length} result${filteredSongs.length !== 1 ? 's' : ''}`
                : 'No results found'}
            </h3>
            {filteredSongs.length > 0 && (
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6">
                <SongList
                  songs={filteredSongs}
                  currentSong={currentSong}
                  isPlaying={isPlaying}
                  onSongSelect={onSongSelect}
                  onPlayPause={onPlayPause}
                />
              </div>
            )}
          </section>
        </>
      )}
    </div>
  )
}
