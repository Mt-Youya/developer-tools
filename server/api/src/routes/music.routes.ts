import Router from "@koa/router"
import { MusicController } from "../controllers/music.controller"
import { rateLimitMiddleware } from "../middlewares/rateLimit"

const musicController = new MusicController()

export const musicRouter = new Router()

const gameRateLimit = rateLimitMiddleware(5, 60)

musicRouter.get("/tracks", gameRateLimit, musicController.getTracks)
