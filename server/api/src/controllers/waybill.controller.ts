import type { Context } from "koa"
import { RedisService } from "../services/redis.service"
import { WaybillService } from "../services/waybill.service"
import { useCacheRequest } from "../utils/isUseCacheRequest"

export class WaybillController {
  private waybillService = new WaybillService()

  getWaybillRoutes = async (ctx: Context): Promise<void> => {
    const trackNo = "SF0252714495269"
    const cookie = ""
    const cacheKey = `waybill:${trackNo}:${cookie}`
    try {
      const useCache = await useCacheRequest<any[]>(ctx, cacheKey)
      if (useCache) {
        return
      }
      const result = await this.waybillService.getWaywill()
      ctx.body = result
      RedisService.cacheResponseData(cacheKey, result, 300)
    } catch (error: any) {
      ctx.throw(500, `获取 Epic Games 数据失败: ${error.message}`)
    }
  }
}
