import type { ResponseData } from "@devtools/shared"
import type { Context } from "koa"
import { WaybillService } from "src/services/waybill.service"

export class WaybillController {
  private waybillService = new WaybillService()

  getWaybillRoutes = async (ctx: Context): Promise<void> => {
    try {
      const result = await this.waybillService.getWaywill()

      console.log("waybill result:", result)

      const response: ResponseData = {
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
