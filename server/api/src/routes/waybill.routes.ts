import Router from "@koa/router"
import { cacheMiddleware } from "src/middlewares/cache"
import { WaybillController } from "../controllers/waybill.controller"
import { rateLimitMiddleware } from "../middlewares/rateLimit"

const waybillController = new WaybillController()

export const waybillRouter = new Router()

const gameRateLimit = rateLimitMiddleware()

waybillRouter.get("/routes", gameRateLimit, cacheMiddleware(600), waybillController.getWaybillRoutes)
