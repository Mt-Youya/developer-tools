import type { ResponseData, WeatherResponse } from "@devtools/shared"
import axios from "axios"
import { RedisService } from "./redis.service"

type ResultData = ResponseData<WeatherResponse>
export class WeatherService {
  private httpClient = axios.create({
    timeout: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  })

  async getWeather(location = "101010300") {
    const cacheKey = `location:${location}`
    console.log("weather cacheKey:", cacheKey)

    try {
      const cached = await RedisService.getCachedResponseData<WeatherResponse>(cacheKey)
      if (cached) {
        return {
          success: true,
          data: cached,
        }
      }

      const response = await this.httpClient.get<ResultData>(`https://api.codelife.cc/api/getWeather`, {
        params: {
          lang: "cn",
          type: "city",
          location,
        },
      })

      console.log("Weather response: ", response)

      const { data, code, msg } = response.data

      const success = code === 200
      // 缓存结果
      if (success) {
        await RedisService.cacheResponseData(cacheKey, data, 300)
      }

      return {
        success,
        data,
        error: !success ? msg : null,
      }
    } catch (error: any) {
      console.error("Weather API error:", error.message)
      return {
        code: 500,
        success: false,
        data: [],
        error: this.getErrorMessage(error),
      }
    }
  }

  private getErrorMessage(error: any) {
    if (error.response) {
      return `API Error: ${error.response.status} ${error.response.statusText}`
    } else if (error.request) {
      return "Network Error: Unable to connect to weather service"
    } else {
      return `Request Error: ${error.message}`
    }
  }
}
