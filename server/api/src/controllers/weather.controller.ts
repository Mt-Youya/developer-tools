import { isNil } from "@devtools/utils"
import type { Context } from "koa"
import { WeatherService } from "../services/weather.service"

export class WeatherController {
  private service = new WeatherService()

  getWeather = async (ctx: Context) => {
    try {
      const params = new URLSearchParams(ctx.request.querystring)
      const location = params.get("location")
      if (isNil(location) || location.trim() === "") {
        throw new Error("缺少必要参数 location")
      }

      ctx.body = await this.service.getWeather(location)
    } catch (error: any) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: `weather getWeather: ${error.message}`,
      }
    }
  }
}
