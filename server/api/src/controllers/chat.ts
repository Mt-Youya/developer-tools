import { isNil } from "@devtools/utils"
import type { Context } from "koa"
import { ChatService } from "../services/chat.service"

export class ChatController {
  private service = new ChatService()

  openai = async (ctx: Context) => {
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
