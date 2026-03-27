import Router from "@koa/router"
import { GameController } from "../controllers/games.controller"
import { rateLimitMiddleware } from "../middlewares/rateLimit"

const gameController = new GameController()

export const gamesRouter = new Router()

// 游戏接口限流：每分钟最多60次请求
const _gameRateLimit = rateLimitMiddleware()

// 为不同平台设置不同的缓存时间
gamesRouter
  .get("/epic", _gameRateLimit, gameController.getEpicGames) // 5分钟缓存
  .get("/freetogame", _gameRateLimit, gameController.getFreeToGame) // 10分钟缓存
  .get("/gog", _gameRateLimit, gameController.getGOGGames) // 10分钟缓存
  .get("/cheapshark", _gameRateLimit, gameController.getCheapShark) // 5分钟缓存
  .get("/all", gameController.getAllGames) // 2分钟缓存
