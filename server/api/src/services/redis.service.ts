import { redis } from "../redis/connection"

export class RedisService {
  // 用户相关缓存
  private static readonly USER_PREFIX = "user:"
  private static readonly USER_SESSION_PREFIX = "user_session:"
  private static readonly USER_CACHE_TTL = 3600 // 1小时

  // API 缓存
  private static readonly API_CACHE_PREFIX = "api_cache:"
  private static readonly API_CACHE_TTL = 300 // 5分钟

  // 限流
  private static readonly RATE_LIMIT_PREFIX = "rate_limit:"

  static get TTL() {
    return RedisService.API_CACHE_TTL
  }

  // 用户缓存方法
  static async cacheUser(user: any) {
    const key = `${RedisService.USER_PREFIX}${user.id}`
    await redis.set(key, user, RedisService.USER_CACHE_TTL)
  }

  static async getCachedUser<T = any>(userId: string) {
    const key = `${RedisService.USER_PREFIX}${userId}`
    return await redis.get<T>(key)
  }

  static async invalidateUserCache(userId: string) {
    const key = `${RedisService.USER_PREFIX}${userId}`
    await redis.del(key)
  }

  // 会话管理
  static async setUserSession(userId: string, sessionData: any, ttl = 86400) {
    const key = `${RedisService.USER_SESSION_PREFIX}${userId}`
    await redis.set(key, sessionData, ttl)
  }

  static async getUserSession<T = any>(userId: string) {
    const key = `${RedisService.USER_SESSION_PREFIX}${userId}`
    return await redis.get<T>(key)
  }

  static async deleteUserSession(userId: string) {
    const key = `${RedisService.USER_SESSION_PREFIX}${userId}`
    await redis.del(key)
  }

  // API 缓存
  static async cacheResponseData<T = any>(key: string, data: T, ttl = RedisService.TTL) {
    const cacheKey = `${RedisService.API_CACHE_PREFIX}${key}`
    await redis.set(cacheKey, data, ttl)
  }

  static async getCachedResponseData<T = any>(key: string) {
    const cacheKey = `${RedisService.API_CACHE_PREFIX}${key}`
    return await redis.get<T>(cacheKey)
  }

  static async invalidateApiCache(pattern: string) {
    const client = redis.getClient()
    const keys = await client.keys(`${RedisService.API_CACHE_PREFIX}${pattern}*`)

    if (keys.length > 0) {
      await client.del(...keys)
    }
  }

  // 限流
  static async checkRateLimit(identifier: string, maxRequests: number, windowSeconds: number) {
    const key = `${RedisService.RATE_LIMIT_PREFIX}${identifier}`
    const now = Math.floor(Date.now() / 1000)
    const windowStart = now - windowSeconds

    const client = redis.getClient()

    // 使用 Redis 事务
    const multi = client.multi()
    multi.zremrangebyscore(key, 0, windowStart)
    multi.zadd(key, now, `${now}-${Math.random()}`)
    multi.zcard(key)
    multi.expire(key, windowSeconds)

    const results = await multi.exec()
    const requestCount = results ? parseInt(results[2][1] as string, 10) : 0

    return {
      allowed: requestCount <= maxRequests,
      remaining: Math.max(0, maxRequests - requestCount),
      reset: now + windowSeconds,
    }
  }

  // 发布/订阅（可选）
  static async publish(channel: string, message: any) {
    const client = redis.getClient()
    const stringMessage = typeof message === "string" ? message : JSON.stringify(message)
    await client.publish(channel, stringMessage)
  }

  // 队列操作
  static async enqueue(queueName: string, job: any) {
    await redis.lpush(`queue:${queueName}`, job)
  }

  static async dequeue<T = any>(queueName: string) {
    return await redis.rpop<T>(`queue:${queueName}`)
  }

  // 健康检查
  static async healthCheck() {
    try {
      await redis.set("healthcheck", "ok", 10)
      const result = await redis.get("healthcheck")
      return result === "ok"
    } catch {
      return false
    }
  }
}

// import { RedisService } from './redis.service'

// // 缓存数据
// await RedisService.cacheResponseData('my-key', data, 300)

// // 获取缓存
// const cached = await RedisService.getCachedResponseData('my-key')

// // 用户会话
// await RedisService.setUserSession(userId, sessionData)
// const session = await RedisService.getUserSession(userId)
