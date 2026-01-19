import { IS_DEV } from "./envConf"

// 通用的 fetch 封装
async function apiRequest(...args: Parameters<typeof fetch>) {
  const [url, options] = args
  const config = {
    headers: {
      "Content-Type": "application/json",
      ...options?.headers,
    },
    ...options,
  }

  try {
    const response = await fetch(url, config).catch((err) => {
      console.error("Fetch error:", err)
      return {
        ok: false,
        status: 500,
        statusText: "Network Error",
        json: async () => ({}),
      }
    })

    if (!response.ok) {
      console.error(`API Error: ${response.status} ${response.statusText}`)
      return null // 失败时返回 null
    }

    return await response.json()
  } catch (error) {
    console.error("API Request failed:", error)
    return null // 捕获异常时返回 null
  }
}

export interface Game {
  id: string
  title: string
  description: string
  url: string
  platform: string
  image: string
  originalPrice: number
  discountPrice: number
  startDate: string
  endDate: string
  genre: string
  developer: string
}
// Epic Games API
export async function fetchEpicGames(params = {}) {
  const searchParams = new URLSearchParams({
    locale: "zh-CN",
    country: "CN",
    allowCountries: "CN",
    ...params,
  })

  let apiUrl
  if (IS_DEV) {
    // 开发环境：使用 Vite 代理
    apiUrl = `/api/epic/freeGamesPromotions?${searchParams.toString()}`
  } else {
    // 生产环境：使用 Cloudflare Pages Functions
    apiUrl = `/api/epic?${searchParams.toString()}`
  }

  const data = await apiRequest(apiUrl).catch((_) => null)

  // 处理和过滤数据
  const games: any[] = data?.data?.Catalog?.searchStore?.elements ?? []

  return games
    .filter((game) => {
      const price = game?.price?.totalPrice?.discountPrice ?? game?.price?.totalPrice?.originalPrice
      const hasPromotion = game?.promotions?.promotionalOffers?.length > 0
      return price === 0 && hasPromotion
    })
    .map((game) => ({
      ...game,
      id: game.id || game.gameId,
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
    })) as Game[]
}

// Steam 免费游戏 API
export async function fetchSteamFreeGames() {
  let apiUrl
  if (IS_DEV) {
    apiUrl =
      "/api/steam/search/results/?query=&start=0&count=50&dynamic_data=&sort_by=_ASC&tags=113&snr=1_7_7_popularnew_7&infinite=1"
  } else {
    apiUrl = "/api/steam"
  }

  try {
    const data = await apiRequest(apiUrl).catch((_) => null)
    // 处理 Steam 数据（数据结构可能不同）
    return data?.results_html
      ? parseSteamHTML(data.results_html)
      : data?.games.map((game) => ({
          ...game,
          id: game.appid || game.id,
          title: game.name || game.title,
          description: game.short_description || game.description || "免费游戏",
          url: game.url || game.game_url || "",
          platform: "Steam",
          image: game.img_url || game.image || "",
          genre: game.genre || "未知",
          developer: game.developer || "未知",
          releaseDate: game.release_date || game.releaseDate || "未知",
        })) || []
  } catch (error) {
    console.error("Steam API failed:", error)
    return []
  }
}

// 第三方免费游戏聚合 API
export async function fetchFreeToGameList(params = {}) {
  const searchParams = new URLSearchParams({
    platform: IS_DEV ? "pc" : "aggregated",
    "sort-by": "popularity",
    ...params,
  })

  let apiUrl
  if (IS_DEV) {
    apiUrl = `/api/freetogame/games?${searchParams.toString()}`
  } else {
    apiUrl = `/api/free-games?${searchParams.toString()}`
  }

  try {
    const data = await apiRequest(apiUrl).catch((_) => null)
    const result = Array.isArray(data) ? data : data?.aggregated || []
    return result.map((game) => ({
      ...game,
      id: game.id,
      title: game.title,
      description: game.short_description || game.description || "免费游戏",
      url: game.game_url || game.freetogame_profile_url || game.url,
      platform: game.publisher || game.platform,
      image: game.thumbnail || game.image,
      genre: game.genre,
      releaseDate: game.release_date || game.releaseDate,
      developer: game.developer,
    }))
  } catch (error) {
    console.error("FreeToGame API failed:", error)
    return []
  }
}

// GOG 免费游戏 API
export async function fetchGOGFreeGames() {
  let apiUrl
  if (IS_DEV) {
    // 开发环境：使用 Vite 代理（需要配置 GOG 代理）
    apiUrl = "/api/gog/games/ajax/filtered?mediaType=game&price=free&sort=popularity&page=1"
  } else {
    // 生产环境：使用 Cloudflare Pages Functions
    apiUrl = "/api/gog"
  }

  try {
    const data = await apiRequest(apiUrl).catch((_) => null)

    // 处理 GOG API 响应
    const games = data?.products || []

    return games.map((game) => ({
      ...game,
      id: `gog-${game.id || Math.random()}`,
      title: game.title,
      description: game.genre || "GOG 免费游戏",
      url: `https://www.gog.com${game.url}`,
      platform: "GOG",
      image: game.image ? `https:${game.image}_product_card_v2_mobile_slider_639.jpg` : "",
      originalPrice: game.price?.baseAmount || 0,
      discountPrice: game.price?.finalAmount || 0,
      genre: game.genre || "未知",
      developer: game.developer || "未知",
      releaseDate: game.releaseDate,
    }))
  } catch (error) {
    console.error("GOG API failed:", error)
    return []
  }
}

// CheapShark API - 获取限时免费游戏
export async function fetchCheapSharkFreeGames() {
  let apiUrl
  if (IS_DEV) {
    apiUrl = "/api/cheapshark/deals?upperPrice=0&pageSize=20"
  } else {
    // 可能需要通过 Cloudflare Functions 代理
    apiUrl = "https://www.cheapshark.com/api/1.0/deals?upperPrice=0&pageSize=20"
  }

  try {
    const data = await apiRequest(apiUrl).catch((_) => null)

    return Array.isArray(data)
      ? data
          .map((game) => ({
            ...game,
            id: game.dealID ? `cheapshark-${game.dealID}` : game.id,
            title: game.title,
            description: game.description || `原价 ${game.normalPrice}，限时免费`,
            url: game.dealID ? `https://www.cheapshark.com/redirect?dealID=${game.dealID}` : game.url,
            platform: game.storeID === "1" ? "Steam" : "Other",
            image: game.thumb || game.image || "",
            originalPrice: parseFloat(game.normalPrice) || 0,
            discountPrice: parseFloat(game.salePrice) || 0,
            genre: game.genre || "限时免费",
            developer: game.developer || "未知",
          }))
          .filter((game) => parseFloat(game.originalPrice) > 0)
      : []
  } catch (error) {
    console.error("CheapShark API failed:", error)
    return []
  }
}

// 获取所有平台的免费游戏
export async function fetchAllFreeGames() {
  const results = await Promise.allSettled([
    fetchEpicGames(),
    fetchFreeToGameList(),
    fetchGOGFreeGames(),
    fetchCheapSharkFreeGames(),
    fetchSteamFreeGames(), // 如果 Steam API 可用
  ])

  return {
    epic: results[0].status === "fulfilled" ? results[0].value : [],
    freetogame: results[1]?.status === "fulfilled" ? results[1]?.value : [],
    gog: results[2]?.status === "fulfilled" ? results[2]?.value : [],
    cheapshark: results[3]?.status === "fulfilled" ? results[3]?.value : [],
    steam: results[4]?.status === "fulfilled" ? results[4]?.value : [],
    errors: results
      .map((result, index) => ({ index, result }))
      .filter(({ result }) => result.status === "rejected")
      .map(({ index, result }) => ({
        platform: ["epic", "freetogame", "gog", "cheapshark", "steam"][index],
        error: result.reason?.message || "未知错误",
      })),
  }
}

// 辅助函数：解析 Steam HTML（如果需要）
function parseSteamHTML(html) {
  // 这里需要根据实际返回的HTML结构来解析
  // 通常 Steam 返回的是 JSON，这里只是示例
  try {
    // 简化的解析逻辑
    const parser = new DOMParser()
    const doc = parser.parseFromString(html, "text/html")
    const gameElements = doc.querySelectorAll(".search_result_row")

    return Array.from(gameElements)
      .map((element) => ({
        id: element.dataset.dsAppid || "",
        title: element.querySelector(".title")?.textContent?.trim() || "",
        url: element.href || "",
        image: element.querySelector("img")?.src || "",
        platform: "Steam" || "",
        description:
          element.querySelector(".search_review_summary")?.getAttribute("data-tooltip-html") || "免费游戏" || "",
        releaseDate: element.querySelector(".search_released")?.textContent?.trim() || "未知",
        genre: "未知",
        developer: "未知",
        originalPrice: 0,
        discountPrice: 0,
        startDate: "",
        endDate: "",
      }))
      .filter((game) => game.title) as Game[]
  } catch (error) {
    console.error("Failed to parse Steam HTML:", error)
    return []
  }
}
