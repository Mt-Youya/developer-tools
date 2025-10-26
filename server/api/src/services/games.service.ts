import type { AllGamesResponse, Game, GamePlatformResponse } from "@devtools/shared"
import axios from "axios"
import { RedisService } from "./redis.service"

export class GameService {
  private httpClient = axios.create({
    timeout: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  })

  // Epic Games 免费游戏
  async getEpicGames(locale: string = "zh-CN", country: string = "CN"): Promise<GamePlatformResponse> {
    const cacheKey = `games:epic:${locale}:${country}`

    try {
      const cached = await RedisService.getCachedApiResponse<Game[]>(cacheKey)
      if (cached) {
        return {
          success: true,
          data: cached,
          platform: "Epic Games",
          count: cached.length,
        }
      }

      const response = await this.httpClient.get(
        "https://store-site-backend-static.ak.epicgames.com/freeGamesPromotions",
        {
          params: {
            locale,
            country,
            allowCountries: country,
          },
        }
      )

      const games = response.data?.data?.Catalog?.searchStore?.elements || []

      const processedGames: Game[] = games
        .filter((game: any) => {
          const price = game?.price?.totalPrice?.discountPrice ?? game?.price?.totalPrice?.originalPrice
          const hasPromotion = game?.promotions?.promotionalOffers?.length > 0
          return price === 0 && hasPromotion
        })
        .map((game: any) => ({
          id: game.id,
          title: game.title,
          description: game.description,
          url: `https://www.epicgames.com/store/zh-CN/p/${game?.catalogNs?.mappings?.[0]?.pageSlug || game?.productSlug}`,
          platform: "Epic Games",
          image:
            game?.keyImages?.find((img: any) => img.type === "OfferImageWide")?.url ||
            game?.keyImages?.find((img: any) => img.type === "Thumbnail")?.url ||
            "",
          originalPrice: game?.price?.totalPrice?.originalPrice || 0,
          discountPrice: game?.price?.totalPrice?.discountPrice || 0,
          startDate: game?.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]?.startDate,
          endDate: game?.promotions?.promotionalOffers?.[0]?.promotionalOffers?.[0]?.endDate,
          genre: game?.categories?.map((cat: any) => cat.path)?.join(", ") || "未知",
          developer: game?.seller?.name || "未知",
        }))

      // 缓存结果
      await RedisService.cacheApiResponse(cacheKey, processedGames, 300)

      return {
        success: true,
        data: processedGames,
        platform: "Epic Games",
        count: processedGames.length,
      }
    } catch (error: any) {
      console.error("Epic Games API error:", error.message)
      return {
        success: false,
        data: [],
        platform: "Epic Games",
        count: 0,
        error: this.getErrorMessage(error),
      }
    }
  }

  // FreeToGame 免费游戏
  async getFreeToGame(platform: string = "pc"): Promise<GamePlatformResponse> {
    const cacheKey = `games:freetogame:${platform}`

    try {
      const cached = await RedisService.getCachedApiResponse<Game[]>(cacheKey)
      if (cached) {
        return {
          success: true,
          data: cached,
          platform: "FreeToGame",
          count: cached.length,
        }
      }

      const response = await this.httpClient.get("https://www.freetogame.com/api/games", {
        params: {
          platform,
          "sort-by": "popularity",
        },
      })

      const games = Array.isArray(response.data) ? response.data : []

      const processedGames: Game[] = games.map((game: any) => ({
        id: game.id.toString(),
        title: game.title,
        description: game.short_description || game.description || "免费游戏",
        url: game.game_url || game.freetogame_profile_url,
        platform: game.publisher || "FreeToGame",
        image: game.thumbnail,
        originalPrice: 0,
        discountPrice: 0,
        startDate: "",
        endDate: "",
        genre: game.genre,
        developer: game.developer,
        releaseDate: game.release_date,
      }))

      await RedisService.cacheApiResponse(cacheKey, processedGames, 600)

      return {
        success: true,
        data: processedGames,
        platform: "FreeToGame",
        count: processedGames.length,
      }
    } catch (error: any) {
      console.error("FreeToGame API error:", error.message)
      return {
        success: false,
        data: [],
        platform: "FreeToGame",
        count: 0,
        error: this.getErrorMessage(error),
      }
    }
  }

  // GOG 免费游戏
  async getGOGGames(): Promise<GamePlatformResponse> {
    const cacheKey = "games:gog"

    try {
      const cached = await RedisService.getCachedApiResponse<Game[]>(cacheKey)
      if (cached) {
        return {
          success: true,
          data: cached,
          platform: this.mapStoreIdToPlatform("7"),
          count: cached.length,
        }
      }

      const response = await this.httpClient.get("https://catalog.gog.com/v1/catalog", {
        params: {
          limit: "48",
          tags: "is:freegame",
          order: "desc:trending",
          productType: "in:game,pack,dlc,extras",
          page: "1",
          countryCode: "IN",
          locale: "zh-Hans",
          currencyCode: "USD",
        },
      })

      const data = response.data?.products ?? []

      const gamesData = data.map((game) => ({
        id: `gog-${game.id}`,
        title: game.title,
        description: `免费游戏`,
        url: game.storeLink,
        platform: this.mapStoreIdToPlatform("7"),
        image: game.logo,
        originalPrice: 0,
        discountPrice: 0,
        startDate: "",
        endDate: "",
        genre: game.genres?.map((g) => g.name).join(",") || "限时免费",
        developer: game.developer?.join(",") || "未知",
      }))
      await RedisService.cacheApiResponse(cacheKey, gamesData, 600)

      return {
        success: true,
        data: gamesData,
        platform: "GOG",
        count: response.data.productCount,
      }
    } catch (error: any) {
      console.error("GOG API error:", error.message)
      return {
        success: false,
        data: [],
        platform: "GOG",
        count: 0,
        error: this.getErrorMessage(error),
      }
    }
  }

  // CheapShark 限时免费
  async getCheapSharkFreeGames(): Promise<GamePlatformResponse> {
    const cacheKey = "games:cheapshark"

    try {
      const cached = await RedisService.getCachedApiResponse<Game[]>(cacheKey)
      if (cached) {
        return {
          success: true,
          data: cached,
          platform: "CheapShark",
          count: cached.length,
        }
      }

      const response = await this.httpClient.get("https://www.cheapshark.com/api/1.0/deals", {
        params: {
          upperPrice: 0,
          pageSize: 20,
        },
      })

      const games = Array.isArray(response.data) ? response.data : []

      const processedGames: Game[] = games
        .filter((game: any) => parseFloat(game.normalPrice) > 0)
        .map((game: any) => ({
          id: `cheapshark-${game.dealID}`,
          title: game.title,
          description: `原价 $${game.normalPrice}，限时免费`,
          url: `https://www.cheapshark.com/redirect?dealID=${game.dealID}`,
          platform: this.mapStoreIdToPlatform(game.storeID),
          image: game.thumb,
          originalPrice: parseFloat(game.normalPrice) || 0,
          discountPrice: parseFloat(game.salePrice) || 0,
          startDate: "",
          endDate: "",
          genre: game.genre || "限时免费",
          developer: game.developer || "未知",
        }))

      await RedisService.cacheApiResponse(cacheKey, processedGames, 300)

      return {
        success: true,
        data: processedGames,
        platform: "CheapShark",
        count: processedGames.length,
      }
    } catch (error: any) {
      console.error("CheapShark API error:", error.message)
      return {
        success: false,
        data: [],
        platform: "CheapShark",
        count: 0,
        error: this.getErrorMessage(error),
      }
    }
  }

  // 获取所有平台的游戏
  async getAllFreeGames(): Promise<AllGamesResponse> {
    const cacheKey = "games:all"

    try {
      const cached = await RedisService.getCachedApiResponse<AllGamesResponse>(cacheKey)
      if (cached) return cached

      const results = await Promise.allSettled([
        this.getEpicGames(),
        this.getFreeToGame(),
        this.getGOGGames(),
        this.getCheapSharkFreeGames(),
      ])

      const platformResults: { [key: string]: Game[] } = {}
      const counts: { [key: string]: number } = {}
      const errors: { platform: string; error: string }[] = []
      let total = 0

      for (let index = 0; index < results.length; index++) {
        const result = results[index]
        const platformNames = ["epic", "freetogame", "gog", "cheapshark"]
        const platformName = platformNames[index]

        if (result.status === "fulfilled" && result.value.success) {
          platformResults[platformName] = result.value.data
          counts[platformName] = result.value.count
          total += result.value.count
        } else {
          platformResults[platformName] = []
          counts[platformName] = 0
          const error = result.status === "rejected" ? result.reason : result.value.error
          errors.push({
            platform: platformName,
            error: error?.message || "Unknown error",
          })
        }
      }

      const response: AllGamesResponse = {
        success: true,
        data: platformResults,
        counts,
        total,
        ...(errors.length > 0 && { errors }),
      }

      // 缓存所有游戏数据2分钟
      await RedisService.cacheApiResponse(cacheKey, response, 120)

      return response
    } catch (error: any) {
      console.error("Get all games error:", error.message)
      return {
        success: false,
        data: {},
        counts: {},
        total: 0,
        errors: [{ platform: "all", error: this.getErrorMessage(error) }],
      }
    }
  }

  private mapStoreIdToPlatform(storeId: string): string {
    const storeMap: { [key: string]: string } = {
      "1": "Steam",
      "2": "GamersGate",
      "3": "GreenManGaming",
      "4": "Amazon",
      "5": "GameStop",
      "6": "Direct2Drive",
      "7": "GOG",
      "8": "Origin",
      "9": "Get Games",
      "10": "Shiny Loot",
      "11": "Humble Store",
      "12": "Desura",
      "13": "Uplay",
      "14": "IndieGameStand",
      "15": "Fanatical",
      "16": "Gamesrocket",
      "17": "Games Republic",
      "18": "SilaGames",
      "19": "Playfield",
      "20": "ImperialGames",
      "21": "WinGameStore",
      "22": "FunStockDigital",
      "23": "GameBillet",
      "24": "Voidu",
      "25": "Epic Games",
      "26": "Razer Game Store",
      "27": "Gamesplanet",
      "28": "Gamesload",
      "29": "2Game",
      "30": "IndieGala",
      "31": "Blizzard Shop",
      "32": "AllYouPlay",
    }
    return storeMap[storeId] || "Other"
  }

  private getErrorMessage(error: any): string {
    if (error.response) {
      return `API Error: ${error.response.status} ${error.response.statusText}`
    } else if (error.request) {
      return "Network Error: Unable to connect to game service"
    } else {
      return `Request Error: ${error.message}`
    }
  }
}
