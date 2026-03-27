import type { WeatherParams, WeatherResponse } from "@devtools/shared"
import { isNil } from "@devtools/utils"
import type { Context } from "koa"
import { RedisService } from "../services/redis.service"
import { WeatherService } from "../services/weather.service"
import { useCacheRequest } from "../utils/isUseCacheRequest"

export class WeatherController {
  private service = new WeatherService()

  getWeather = async (ctx: Context) => {
    try {
      const { location } = ctx.query as unknown as WeatherParams
      if (isNil(location) || location.trim() === "") {
        throw new Error("缺少必要参数 location")
      }
      const cacheKey = `location:${location}`
      const useCache = await useCacheRequest<WeatherResponse>(ctx, cacheKey)
      if (useCache) {
        return
      }
      const results = await this.service.getWeather(location)
      ctx.body = results
      RedisService.cacheResponseData(cacheKey, results, 300)
    } catch (error: any) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: `weather getWeather: ${error.message}`,
      }
    }
  }
}
