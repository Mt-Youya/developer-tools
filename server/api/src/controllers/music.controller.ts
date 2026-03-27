import type { Context } from "koa"
import { RedisService } from "src/services/redis.service"
import { useCacheRequest } from "src/utils/isUseCacheRequest"
import { MusicService } from "../services/music.service"

export class MusicController {
  private musicService = new MusicService()

  // 获取 Epic Games 免费游戏
  getTracks = async (ctx: Context): Promise<void> => {
    const client_id = "cd43f5d1"
    const limit = 20
    const cacheKey = `tracks:${client_id}:${limit}`

    try {
      const useCache = await useCacheRequest<any[]>(ctx, cacheKey)
      if (useCache) {
        return
      }
      const results = await this.musicService.getTracks()
      ctx.body = results
      RedisService.cacheResponseData(cacheKey, results, 300)
    } catch (error: any) {
      ctx.throw(500, `获取 Epic Games 数据失败: ${error.message}`)
    }
  }
}
