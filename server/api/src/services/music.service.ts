import axios from "axios"
import { RedisService } from "./redis.service"

export class MusicService {
  private httpClient = axios.create({
    timeout: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  })

  async getTracks(client_id = "cd43f5d1", limit = 20): Promise<any> {
    const cacheKey = `tracks:${client_id}:${limit}`

    try {
      const cached = await RedisService.getCachedResponseData<any[]>(cacheKey)
      if (cached) {
        return {
          success: true,
          data: cached,
          platform: "Jamendo",
          count: cached?.length,
        }
      }

      const response = await this.httpClient.get("https://api.jamendo.com", {
        params: {
          client_id,
          limit,
          format: "json",
          order: "popularity_total",
          include: "musicinfo",
        },
      })

      // console.log(" response.data", response.data)

      const { results = [], headers = {} } = response.data
      // console.log("headers", headers)
      const { status } = headers
      const success = status === "success"

      // 缓存结果
      if (results.length) {
        await RedisService.cacheResponseData(cacheKey, results, 300)
      }

      return {
        success,
        data: results,
        platform: "Jamendo",
        error: success ? headers.error_message : "",
      }
    } catch (error: any) {
      console.error("Jamendo API error:", error.message)
      return {
        code: 500,
        success: false,
        data: [],
        platform: "Jamendo",
        error: this.getErrorMessage(error),
      }
    }
  }

  private getErrorMessage(error: any) {
    if (error.response) {
      return `API Error: ${error.response.status} ${error.response.statusText}`
    } else if (error.request) {
      return "Network Error: Unable to connect to music service"
    } else {
      return `Request Error: ${error.message}`
    }
  }
}
