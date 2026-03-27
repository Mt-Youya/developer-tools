import type { AllGamesResponse, Game } from "@devtools/shared"
import type { Context } from "koa"
import { RedisService } from "src/services/redis.service"
import { useCacheRequest } from "src/utils/isUseCacheRequest"
import { GameService } from "../services/games.service"

export class GameController {
  private gameProxyService = new GameService()

  // 获取 Epic Games 免费游戏
  getEpicGames = async (ctx: Context): Promise<void> => {
    try {
      const { locale = "zh-CN", country = "CN" } = ctx.query
      const cacheKey = `games:epic:${locale}:${country}`
      const useCache = await useCacheRequest<Game[]>(ctx, cacheKey)
      if (useCache) {
        return
      }
      const result = await this.gameProxyService.getEpicGames(locale as string, country as string)
      ctx.body = result
      RedisService.cacheResponseData(cacheKey, result, 300)
    } catch (error: any) {
      ctx.throw(500, `获取 Epic Games 数据失败: ${error.message}`)
    }
  }

  // 获取 FreeToGame 免费游戏
  getFreeToGame = async (ctx: Context): Promise<void> => {
    try {
      const { platform = "pc" } = ctx.query
      const cacheKey = `games:freetogame:${platform}`
      const useCache = await useCacheRequest<Game[]>(ctx, cacheKey)
      if (useCache) {
        return
      }
      const result = await this.gameProxyService.getFreeToGame(platform as string)
      ctx.body = result
      RedisService.cacheResponseData(cacheKey, result, 600)
    } catch (error: any) {
      ctx.throw(500, `获取 FreeToGame 数据失败: ${error.message}`)
    }
  }

  // 获取 GOG 免费游戏
  getGOGGames = async (ctx: Context): Promise<void> => {
    try {
      const cacheKey = "games:gog"
      const useCache = await useCacheRequest<Game[]>(ctx, cacheKey)
      if (useCache) {
        return
      }
      const result = await this.gameProxyService.getGOGGames()
      ctx.body = result
      RedisService.cacheResponseData(cacheKey, result, 600)
    } catch (error: any) {
      ctx.throw(500, `获取 GOG 数据失败: ${error.message}`)
    }
  }

  // 获取 CheapShark 限时免费
  getCheapShark = async (ctx: Context): Promise<void> => {
    try {
      const cacheKey = "games:cheapshark"
      const useCache = await useCacheRequest<Game[]>(ctx, cacheKey)
      if (useCache) {
        return
      }
      const result = await this.gameProxyService.getCheapSharkFreeGames()
      ctx.body = result
      RedisService.cacheResponseData(cacheKey, result, 300)
    } catch (error: any) {
      ctx.throw(500, `获取 CheapShark 数据失败: ${error.message}`)
    }
  }

  // 获取所有平台的免费游戏
  getAllGames = async (ctx: Context): Promise<void> => {
    try {
      const cacheKey = "games:all"
      const useCache = await useCacheRequest<AllGamesResponse>(ctx, cacheKey)
      if (useCache) {
        return
      }
      const result = await this.gameProxyService.getAllFreeGames()
      ctx.body = result
      RedisService.cacheResponseData(cacheKey, result, 120)
    } catch (error: any) {
      ctx.throw(500, `获取游戏数据失败: ${error.message}`)
    }
  }
}
