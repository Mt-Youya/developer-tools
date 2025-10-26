export interface Game {
  id: string
  title: string
  description: string
  url: string
  platform: Platform
  image: string
  originalPrice: number
  discountPrice: number
  startDate: string
  endDate: string
  genre: string
  developer: string
  releaseDate?: string
  rating?: number
  tags?: string[]
}

export interface GamePlatformResponse {
  success: boolean
  data: Game[]
  platform: Platform
  count: number
  error?: string
}

export interface AllGamesResponse {
  success: boolean
  data: {
    [platform: Platform]: Game[]
  }
  counts: {
    [platform: Platform]: number
  }
  total: number
  errors?: Array<{
    platform: Platform
    error: string
  }>
}

// type Platform = "epic" | "gog" | "steam" | "freetogame" | "cheapshark"

enum Platform {
  epic,
  gog,
  steam,
  freetogame,
  cheapshark,
}

interface GogGame {
  page: number
  products: any[]
  totalGamesFound: number
  totalMoviesFound: number
  totalPages: number
  totalResults: number
  ts: null | any
}
