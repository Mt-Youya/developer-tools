import type { ApiResponse } from "@devtools/shared"
import type { Context } from "koa"
import { GameService } from "../services/games.service"

export class GameController {
  private gameProxyService = new GameService()

  // 获取 Epic Games 免费游戏
  getEpicGames = async (ctx: Context): Promise<void> => {
    try {
      const { locale = "zh-CN", country = "CN" } = ctx.query

      const result = await this.gameProxyService.getEpicGames(locale as string, country as string)

      const response: ApiResponse = {
        code: 200,
        success: result.success,
        data: result.data,
        ...(result.error && { error: result.error }),
      }

      ctx.body = response
    } catch (error: any) {
      ctx.throw(500, `获取 Epic Games 数据失败: ${error.message}`)
    }
  }

  // 获取 FreeToGame 免费游戏
  getFreeToGame = async (ctx: Context): Promise<void> => {
    try {
      const { platform = "pc" } = ctx.query

      const result = await this.gameProxyService.getFreeToGame(platform as string)

      const response: ApiResponse = {
        code: 200,
        success: result.success,
        data: result.data,
        ...(result.error && { error: result.error }),
      }

      ctx.body = response
    } catch (error: any) {
      ctx.throw(500, `获取 FreeToGame 数据失败: ${error.message}`)
    }
  }

  // 获取 GOG 免费游戏
  getGOGGames = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.gameProxyService.getGOGGames()

      const response: ApiResponse = {
        code: 200,
        success: result.success,
        data: result.data,
        ...(result.error && { error: result.error }),
      }

      ctx.body = response
    } catch (error: any) {
      ctx.throw(500, `获取 GOG 数据失败: ${error.message}`)
    }
  }

  // 获取 CheapShark 限时免费
  getCheapShark = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.gameProxyService.getCheapSharkFreeGames()

      const response: ApiResponse = {
        code: 200,
        success: result.success,
        data: result.data,
        ...(result.error && { error: result.error }),
      }

      ctx.body = response
    } catch (error: any) {
      ctx.throw(500, `获取 CheapShark 数据失败: ${error.message}`)
    }
  }

  // 获取所有平台的免费游戏
  getAllGames = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.gameProxyService.getAllFreeGames()

      const response: ApiResponse = {
        code: 200,
        success: result.success,
        data: result.data,
        ...(result.errors && { errors: result.errors }),
      }

      ctx.body = response
    } catch (error: any) {
      ctx.throw(500, `获取游戏数据失败: ${error.message}`)
    }
  }
}
