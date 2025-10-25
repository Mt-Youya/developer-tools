export interface Song {
  id: string
  title: string
  artist: string
  album: string
  duration: number
  cover: string
  audioUrl: string
  genre: string
}

export interface Playlist {
  id: string
  name: string
  description: string
  cover: string
  songs: Song[]
}

export interface Album {
    id: string
    name: string
    description: string
    cover: string
    songs: Song[]
}
