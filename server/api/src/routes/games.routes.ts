import Router from "koa-router"
import { cacheMiddleware } from "src/middlewares/cache"
import { GameController } from "../controllers/games.controller"
import { rateLimitMiddleware } from "../middlewares/rateLimit"

const gameController = new GameController()

export const gamesRouter = new Router()

// 游戏接口限流：每分钟最多60次请求
const gameRateLimit = rateLimitMiddleware(5, 60)

// 为不同平台设置不同的缓存时间
gamesRouter
  .get("/epic", gameRateLimit, cacheMiddleware(300), gameController.getEpicGames) // 5分钟缓存
  .get("/freetogame", gameRateLimit, cacheMiddleware(600), gameController.getFreeToGame) // 10分钟缓存
  .get("/gog", gameRateLimit, cacheMiddleware(600), gameController.getGOGGames) // 10分钟缓存
  .get("/cheapshark", gameRateLimit, cacheMiddleware(300), gameController.getCheapShark) // 5分钟缓存
  .get("/all", gameRateLimit, cacheMiddleware(120), gameController.getAllGames) // 2分钟缓存
