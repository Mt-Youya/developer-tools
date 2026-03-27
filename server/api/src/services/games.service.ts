import type { AllGamesResponse, Game, GamePlatform, GamePlatformResponse } from "@devtools/shared"
import axios from "axios"

export class GameService {
  private httpClient = axios.create({
    timeout: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  })

  // Epic Games 免费游戏
  async getEpicGames(locale: string = "zh-CN", country: string = "CN"): Promise<GamePlatformResponse> {
    try {
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

      return {
        success: true,
        data: processedGames,
        platform: "epic",
        count: processedGames.length,
        originalResponse: response.data,
      }
    } catch (error: any) {
      console.error("Epic Games API error:", error.message)
      return {
        success: false,
        data: [],
        platform: "epic",
        count: 0,
        error: this.getErrorMessage(error),
        originalResponse: null,
      }
    }
  }

  // FreeToGame 免费游戏
  async getFreeToGame(platform: string = "pc"): Promise<GamePlatformResponse> {
    try {
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
        url: game.freetogame_profile_url,
        platform: game.publisher || "FreeToGame",
        os: game.platform,
        image: game.thumbnail,
        originalPrice: 0,
        discountPrice: 0,
        startDate: "",
        endDate: "",
        genre: game.genre,
        developer: game.developer,
        releaseDate: game.release_date,
      }))

      return {
        success: true,
        data: processedGames,
        platform: "freetogame",
        count: processedGames.length,
        originalResponse: response.data,
      }
    } catch (error: any) {
      console.error("FreeToGame API error:", error.message)
      return {
        success: false,
        data: [],
        platform: "freetogame",
        count: 0,
        error: this.getErrorMessage(error),
        originalResponse: null,
      }
    }
  }

  // GOG 免费游戏
  async getGOGGames(): Promise<GamePlatformResponse> {
    try {
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

      const gamesData = data.map((game: any) => ({
        id: `gog-${game.id}`,
        title: game.title,
        description: game.tags?.map((n: any) => n.name).join(", "),
        url: game.storeLink,
        platform: this.mapStoreIdToPlatform("7"),
        image: game.logo,
        originalPrice: game.price?.baseMoney?.amount,
        discountPrice: game.price?.finalMoney?.amount,
        startDate: "",
        endDate: "",
        releaseDate: game.releaseDate,
        genre: game.genres?.map((g: any) => g.name).join(",") || "限时免费",
        developer: game.developers?.join(",") || "未知",
      }))

      return {
        success: true,
        data: gamesData,
        platform: "gog",
        count: response.data.productCount,
        originalResponse: response.data,
      }
    } catch (error: any) {
      console.error("GOG API error:", error.message)
      return {
        success: false,
        data: [],
        platform: "gog",
        count: 0,
        error: this.getErrorMessage(error),
        originalResponse: null,
      }
    }
  }

  // CheapShark 限时免费
  async getCheapSharkFreeGames(): Promise<GamePlatformResponse> {
    try {
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

      return {
        success: true,
        data: processedGames,
        platform: "cheapshark",
        count: processedGames.length,
        originalResponse: response.data,
      }
    } catch (error: any) {
      console.error("CheapShark API error:", error.message)
      return {
        success: false,
        data: [],
        platform: "cheapshark",
        count: 0,
        error: this.getErrorMessage(error),
        originalResponse: null,
      }
    }
  }

  // 获取所有平台的游戏
  async getAllFreeGames(): Promise<AllGamesResponse> {
    try {
      const results = await Promise.allSettled([
        this.getEpicGames(),
        this.getFreeToGame(),
        this.getGOGGames(),
        this.getCheapSharkFreeGames(),
      ])

      const platformResults: { [platform in GamePlatform]: Game[] } = {
        epic: [],
        steam: [],
        freetogame: [],
        gog: [],
        cheapshark: [],
      }
      const originalResponses: { [key: string]: any } = {}
      const counts: { [platform in GamePlatform]: number } = {
        epic: 0,
        gog: 0,
        steam: 0,
        freetogame: 0,
        cheapshark: 0,
      }
      const errors: { platform: GamePlatform; error: string }[] = []
      let total = 0

      for (let index = 0; index < results.length; index++) {
        const result = results[index]
        const platformNames = ["epic", "freetogame", "gog", "cheapshark"] as const
        const platformName = platformNames[index]

        if (result.status === "fulfilled" && result.value.success) {
          platformResults[platformName] = result.value.data
          originalResponses[platformName] = result.value.originalResponse
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

      return {
        success: true,
        data: platformResults,
        originalResponses,
        counts,
        total,
        ...(errors.length > 0 && { errors }),
      }
    } catch (error: any) {
      console.error("Get all games error:", error.message)
      return {
        success: false,
        data: null,
        counts: null,
        total: 0,
        // @ts-expect-error
        errors: [{ platform: "all", error: this.getErrorMessage(error) }],
      }
    }
  }

  mapStoreIdToPlatform(storeId: string): GamePlatform {
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
    return (storeMap[storeId] as GamePlatform) || "other"
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
