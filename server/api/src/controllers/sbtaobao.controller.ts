import type { Context } from "koa"
import { sbTaobaoService } from "../services/sbTaobao.service"

export class sbTaobaoController {
  private sbTaobaoService = new sbTaobaoService()

  cnmtaobao = async (ctx: Context) => {
    try {
      ctx.body = await this.sbTaobaoService.cnmtb()
    } catch (error: any) {
      ctx.status = 500
      ctx.body = {
        code: 500,
        message: `sbTaobao listVersions: ${error.message}`,
      }
    }
  }
}
