import Router from "@koa/router"
import { ChatController } from "../controllers/chat"
import { cacheMiddleware } from "../middlewares/cache"
import { rateLimitMiddleware } from "../middlewares/rateLimit"

const chatController = new ChatController()

export const chatRouter = new Router()

const gameRateLimit = rateLimitMiddleware(5, 60)

chatRouter.get("/getChat", gameRateLimit, cacheMiddleware(600), chatController.getWeather)
