import type { Context } from "koa"
import { RedisService } from "src/services/redis.service"

export async function useCacheRequest<T = any>(ctx: Context, cacheKey: string) {
  const { header } = ctx.request
  const flag = header["cache-control"] !== "no-store" || header["pragma"] !== "no-cache"
  if (!flag) {
    return
  }
  const cached = await RedisService.getCachedResponseData<T>(cacheKey)
  ctx.body = { ...cached, message: "From Cache" }
  return cached
}
