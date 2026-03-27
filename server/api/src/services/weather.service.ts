import type { ResponseData, WeatherParams, WeatherResponse } from "@devtools/shared"
import axios from "axios"

type ResultData = ResponseData<WeatherResponse>
export class WeatherService {
  private httpClient = axios.create({
    timeout: 10000,
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
    },
  })

  async getWeather(location: WeatherParams["location"] = "101010300") {
    try {
      const response = await this.httpClient.get<ResultData>(`https://api.codelife.cc/api/getWeather`, {
        params: {
          lang: "cn",
          type: "city",
          location,
        },
      })

      const { data, code, msg } = response.data
      const success = code === 200
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
