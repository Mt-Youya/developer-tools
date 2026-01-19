import type { Context, Next } from "koa"
import { RedisService } from "../services/redis.service"

export function rateLimitMiddleware(maxRequests: number = 100, windowSeconds: number = 3600) {
  return async (ctx: Context, next: Next): Promise<void> => {
    const identifier = ctx.ip || ctx.request.ip

    const limit = await RedisService.checkRateLimit(identifier, maxRequests, windowSeconds)

    ctx.set("X-RateLimit-Limit", maxRequests.toString())
    ctx.set("X-RateLimit-Remaining", limit.remaining.toString())
    ctx.set("X-RateLimit-Reset", limit.reset.toString())

    if (!limit.allowed) {
      ctx.status = 429
      ctx.body = {
        success: false,
        error: "Too many requests",
        retryAfter: limit.reset - Math.floor(Date.now() / 1000),
      }
      return
    }

    await next()
  }
}
