import type { ApiResponse, Game } from "@devtools/shared"

const API_BASE = "/api/v1"

// 简化的通用请求函数
async function apiRequest<T>(endpoint: string): Promise<ApiResponse<T>> {
  try {
    const response = await fetch(`${API_BASE}${endpoint}`)

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`)
    }

    return await response.json()
  } catch (error) {
    console.error(`API Request failed for ${endpoint}:`, error)
    return {
      success: false,
      error: error instanceof Error ? error.message : "Unknown error",
    }
  }
}

// Epic Games
export async function fetchEpicGames(params?: { locale?: string; country?: string }): Promise<Game[]> {
  const searchParams = new URLSearchParams()
  if (params?.locale) searchParams.append("locale", params.locale)
  if (params?.country) searchParams.append("country", params.country)

  const queryString = searchParams.toString()
  const endpoint = `/games/epic${queryString ? `?${queryString}` : ""}`

  const response = await apiRequest<Game[]>(endpoint)
  return response.success ? response.data : []
}

// FreeToGame
export async function fetchFreeToGame(params?: { platform?: string }): Promise<Game[]> {
  const searchParams = new URLSearchParams()
  if (params?.platform) searchParams.append("platform", params.platform)

  const queryString = searchParams.toString()
  const endpoint = `/games/freetogame${queryString ? `?${queryString}` : ""}`

  const response = await apiRequest<Game[]>(endpoint)
  return response.success ? response.data : []
}

// GOG
export async function fetchGOGGames(): Promise<Game[]> {
  const response = await apiRequest<Game[]>("/games/gog")
  return response.success ? response.data : []
}

// CheapShark
export async function fetchCheapSharkFreeGames(): Promise<Game[]> {
  const response = await apiRequest<Game[]>("/games/cheapshark")
  return response.success ? response.data : []
}

// 所有平台
export async function fetchAllFreeGames(): Promise<{ [platform: string]: Game[] }> {
  const response = await apiRequest<{ [platform: string]: Game[] }>("/games/all")
  return response.success ? response.data : {}
}

// 获取所有平台游戏（带错误信息）
export async function fetchAllGamesWithStatus() {
  const response = await apiRequest<any>("/games/all")
  return response
}
