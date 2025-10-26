import type { Context, Next } from "koa"
import { RedisService } from "../services/redis.service"

export function cacheMiddleware(ttl: number = 300) {
  return async (ctx: Context, next: Next): Promise<void> => {
    // 只缓存 GET 请求
    if (ctx.method !== "GET") {
      return await next()
    }

    const cacheKey = `${ctx.path}?${ctx.querystring}`

    // 尝试从缓存获取
    const cached = await RedisService.getCachedApiResponse(cacheKey)

    if (cached) {
      ctx.body = cached
      ctx.set("X-Cache", "HIT")
      return
    }

    await next()

    // 缓存响应
    if (ctx.status === 200 && ctx.body) {
      await RedisService.cacheApiResponse(cacheKey, ctx.body, ttl)
      ctx.set("X-Cache", "MISS")
    }
  }
}
