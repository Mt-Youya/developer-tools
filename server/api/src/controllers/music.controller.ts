import type { ApiResponse } from "@devtools/shared"
import type { Context } from "koa"
import { MusicService } from "../services/music.service"

export class MusicController {
  private musicService = new MusicService()

  // 获取 Epic Games 免费游戏
  getTracks = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.musicService.getTracks()

      console.log("traskcs")

      const response: ApiResponse = {
        code: 200,
        ...result,
        ...(result.error && { error: result.error }),
      }

      ctx.body = response
    } catch (error: any) {
      ctx.throw(500, `获取 Epic Games 数据失败: ${error.message}`)
    }
  }
}
