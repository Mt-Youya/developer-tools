import Redis from "ioredis"
import { config } from "../config"

const redisConfig = {
  host: config.redis.host || "localhost",
  port: config.redis.port,
  password: config.redis.password,
  db: config.redis.db,
  retryDelayOnFailover: 100,
  maxRetriesPerRequest: 3,
  lazyConnect: true,
}

class RedisClient {
  private client: Redis
  private isConnected: boolean = false

  constructor() {
    this.client = new Redis(redisConfig)
    this.setupEventListeners()
  }

  private setupEventListeners(): void {
    this.client.on("connect", () => {
      console.log("✅ Redis connected")
      this.isConnected = true
    })

    this.client.on("error", (error) => {
      console.error("❌ Redis error:", error)
      this.isConnected = false
    })

    this.client.on("close", () => {
      console.log("🔌 Redis connection closed")
      this.isConnected = false
    })

    this.client.on("reconnecting", () => {
      console.log("🔄 Redis reconnecting...")
    })
  }

  async connect(): Promise<void> {
    if (!this.isConnected) {
      await this.client.connect()
    }
  }

  async disconnect(): Promise<void> {
    await this.client.quit()
  }

  async set(key: string, value: any, expirySeconds?: number): Promise<void> {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value)

    if (expirySeconds) {
      await this.client.setex(key, expirySeconds, stringValue)
    } else {
      await this.client.set(key, stringValue)
    }
  }

  async get<T = any>(key: string): Promise<T | null> {
    const value = await this.client.get(key)

    if (!value) return null

    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }

  async del(key: string): Promise<void> {
    await this.client.del(key)
  }

  async exists(key: string): Promise<boolean> {
    const result = await this.client.exists(key)
    return result === 1
  }

  async incr(key: string): Promise<number> {
    return await this.client.incr(key)
  }

  async expire(key: string, seconds: number): Promise<void> {
    await this.client.expire(key, seconds)
  }

  // 哈希操作
  async hset(key: string, field: string, value: any): Promise<void> {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value)
    await this.client.hset(key, field, stringValue)
  }

  async hget<T = any>(key: string, field: string): Promise<T | null> {
    const value = await this.client.hget(key, field)

    if (!value) return null

    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }

  // 列表操作
  async lpush(key: string, value: any): Promise<void> {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value)
    await this.client.lpush(key, stringValue)
  }

  async rpop<T = any>(key: string): Promise<T | null> {
    const value = await this.client.rpop(key)

    if (!value) return null

    try {
      return JSON.parse(value) as T
    } catch {
      return value as T
    }
  }

  // 集合操作
  async sadd(key: string, value: any): Promise<void> {
    const stringValue = typeof value === "string" ? value : JSON.stringify(value)
    await this.client.sadd(key, stringValue)
  }

  async smembers<T = any>(key: string): Promise<T[]> {
    const values = await this.client.smembers(key)
    return values.map((value) => {
      try {
        return JSON.parse(value) as T
      } catch {
        return value as T
      }
    })
  }

  getClient(): Redis {
    return this.client
  }

  isReady(): boolean {
    return this.isConnected
  }
}

export const redis = new RedisClient()
