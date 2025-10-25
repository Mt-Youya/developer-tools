import { Loader } from "@devtools/ui/Loader"
import React, { Suspense, useEffect, useState } from "react"
import type { Playlist, Song } from "@/types/music"
import { HomeView } from "./components/HomeView"
import { LibraryView } from "./components/LibraryView"
import Player from "./components/Player"
import SearchView from "./components/SearchVIew"
import { Sidebar } from "./components/SideBar"
import { playlists, songs } from "./data/mockMusic"

export interface JamendoTrack {
  id: string
  name: string
  artist_name: string
  album_name: string
  duration: number
  audio: string
  image: string
  waveform: string
}
// 转换为应用的 Song 格式
export const convertJamendoToSong = (track: JamendoTrack) => ({
  id: track.id,
  title: track.name,
  artist: track.artist_name,
  album: track.album_name,
  duration: track.duration,
  cover: track.image,
  audioUrl: track.audio,
  genre: "Various",
})

// https://blog.csdn.net/weixin_42465759/article/details/138619479

function Play() {
  const [activeView, setActiveView] = useState("home")
  const [currentSong, setCurrentSong] = useState<Song | null>(null)
  const [isPlaying, setIsPlaying] = useState(false)
  const [currentPlaylist, setCurrentPlaylist] = useState<Song[]>(songs)
  const [currentIndex, setCurrentIndex] = useState(0)

  const FMA_API_BASE = "https://freemusicarchive.org/api/get"

  const JAMENDO_CLIENT_ID = "cd43f5d1"
  // Initialize with first song
  useEffect(() => {
    fetch(
      `/api/tracks/v3.0/tracks/?client_id=${JAMENDO_CLIENT_ID}&format=json&limit=${20}&order=popularity_total&include=musicinfo`
    )
      .then((res) => res.json())
      .then(({ results = [] }) => {
        const tracks = results.map((track: JamendoTrack) => convertJamendoToSong(track))
        setCurrentPlaylist(tracks)
        setCurrentSong(tracks[0])
      })
  }, [])

  const handleSongSelect = (song: Song) => {
    const index = currentPlaylist.findIndex((s) => s.id === song.id)
    setCurrentIndex(index)
    setCurrentSong(song)
    setIsPlaying(true)
  }

  function handlePlayPause() {
    setIsPlaying(!isPlaying)
  }

  function handleNext() {
    const nextIndex = (currentIndex + 1) % currentPlaylist.length
    setCurrentIndex(nextIndex)
    setCurrentSong(currentPlaylist[nextIndex])
    setIsPlaying(true)
  }

  function handlePrevious() {
    const prevIndex = currentIndex === 0 ? currentPlaylist.length - 1 : currentIndex - 1
    setCurrentIndex(prevIndex)
    setCurrentSong(currentPlaylist[prevIndex])
    setIsPlaying(true)
  }

  const handlePlaylistPlay = (playlist: Playlist) => {
    setCurrentPlaylist(playlist.songs)
    setCurrentIndex(0)
    setCurrentSong(playlist.songs[0])
    setIsPlaying(true)
  }

  function renderView() {
    switch (activeView) {
      case "home":
        return (
          <Suspense fallback={<Loader />}>
            <HomeView playlists={playlists} onPlaylistPlay={handlePlaylistPlay} />
          </Suspense>
        )
      case "search":
        return (
          <SearchView
            songs={songs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onSongSelect={handleSongSelect}
            onPlayPause={handlePlayPause}
          />
        )
      case "library":
      case "songs":
        return (
          <LibraryView
            songs={songs}
            currentSong={currentSong}
            isPlaying={isPlaying}
            onSongSelect={handleSongSelect}
            onPlayPause={handlePlayPause}
          />
        )
      default:
        return <HomeView playlists={playlists} onPlaylistPlay={handlePlaylistPlay} />
    }
  }

  return (
    <div className="h-screen flex flex-col bg-linear-to-b from-gray-900 to-black text-white overflow-hidden">
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <Sidebar activeView={activeView} onViewChange={setActiveView} />

        {/* Main Content */}
        <main className="flex-1 overflow-y-auto bg-linear-to-b from-blue-900/20 to-gray-900">
          {renderView()}
          {/* Spacer for player */}
          <div className="h-32" />
        </main>
      </div>

      {/* Player */}
      <Player
        currentSong={currentSong}
        isPlaying={isPlaying}
        onPlayPause={handlePlayPause}
        onNext={handleNext}
        onPrevious={handlePrevious}
        playlist={currentPlaylist}
      />
    </div>
  )
}

export default Play
