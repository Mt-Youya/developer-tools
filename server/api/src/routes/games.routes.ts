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
  .get("/epic", gameController.getEpicGames) // 5分钟缓存
  .get("/freetogame", gameController.getFreeToGame) // 10分钟缓存
  .get("/gog", gameController.getGOGGames) // 10分钟缓存
  .get("/cheapshark", gameController.getCheapShark) // 5分钟缓存
  .get("/all", gameController.getAllGames)
