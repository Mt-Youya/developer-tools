export interface Game {
  id: string
  title: string
  description: string
  url: string
  platform: GamePlatform
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
  platform: GamePlatform
  count: number
  error?: string
  originalResponse: { [key: string]: any } | null
}

export interface AllGamesResponse {
  success: boolean
  data:
    | {
        [platform in GamePlatform]: Game[]
      }
    | null
  counts:
    | {
        [platform in GamePlatform]: number
      }
    | null
  total: number
  errors?: { platform: GamePlatform; error: string }[]
  originalResponses: { [key: string]: any }
}

export type GamePlatform = "epic" | "gog" | "steam" | "freetogame" | "cheapshark"

interface GogGame {
  page: number
  products: any[]
  totalGamesFound: number
  totalMoviesFound: number
  totalPages: number
  totalResults: number
  ts: null | any
}
