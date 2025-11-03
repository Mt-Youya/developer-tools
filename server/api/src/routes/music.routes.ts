import Router from "koa-router"
import { MusicController } from "../controllers/music.controller"
import { rateLimitMiddleware } from "../middlewares/rateLimit"

const musicController = new MusicController()

export const musicRouter = new Router()

const gameRateLimit = rateLimitMiddleware(5, 60)

// 为不同平台设置不同的缓存时间
musicRouter.get("/tracks", musicController.getTracks) // 5分钟缓存
