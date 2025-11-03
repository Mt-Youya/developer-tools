import Koa from "koa"
import bodyParser from "koa-bodyparser"
import compress from "koa-compress"
import cors from "koa-cors"
import helmet from "koa-helmet"
import Router from "koa-router"
import { config } from "./config"
import { cacheMiddleware } from "./middlewares/cache"
import { errorHandler } from "./middlewares/errorHandler"
import { loggerMiddleware } from "./middlewares/logger"
import { rateLimitMiddleware } from "./middlewares/rateLimit"
import { gamesRouter } from "./routes/games.routes"
import { musicRouter } from "./routes/music.routes"
import { logger } from "./utils/logger"

export function createApp() {
  const app = new Koa()

  // 全局中间件（顺序很重要）
  app.use(errorHandler)
  app.use(loggerMiddleware)
  app.use(helmet())
  app.use(compress())
  // app.use(
  //   cors({
  //     origin: config.cors.origin,
  //     credentials: true,
  //   })
  // )
  app.use(
    bodyParser({
      jsonLimit: "10mb",
      formLimit: "10mb",
      textLimit: "10mb",
    })
  )

  // Redis 相关中间件
  app.use(rateLimitMiddleware(600000, 3600))
  app.use(cacheMiddleware(300))

  // API 路由
  const apiRouter = new Router({ prefix: config.apiPrefix })

  // 健康检查
  apiRouter.get("/health", async (ctx) => {
    const redisHealth = await import("./services/redis.service").then((module) => module.RedisService.healthCheck())
    ctx.body = {
      success: true,
      data: {
        status: "ok",
        timestamp: new Date().toISOString(),
        uptime: process.uptime(),
        environment: config.env,
        redis: redisHealth ? "healthy" : "unhealthy",
      },
    }
  })

  // 业务路由
  apiRouter.use("/games", gamesRouter.routes(), gamesRouter.allowedMethods())
  apiRouter.use("/music", musicRouter.routes(), musicRouter.allowedMethods())

  // apiRouter.use("/auth", authRouter.routes(), authRouter.allowedMethods())
  // apiRouter.use("/users", userRouter.routes(), userRouter.allowedMethods())

  // 挂载 API 路由
  app.use(apiRouter.routes())
  app.use(apiRouter.allowedMethods())

  // 404 处理
  app.use(async (ctx) => {
    ctx.status = 404
    ctx.body = {
      success: false,
      error: {
        message: "Route not found",
        code: "NOT_FOUND",
      },
    }
  })

  // 错误事件监听
  app.on("error", (err, ctx) => {
    logger.error("Unhandled error:", err, {
      url: ctx?.url,
      method: ctx?.method,
    })
  })

  // 打印所有注册的路由
  console.log("📋 Registered routes:")
  function printRoutes(layer: any, prefix: string = "") {
    if (layer.methods && layer.methods.length > 0) {
      const method = layer.methods.join(",").toUpperCase()
      const path = layer.path === "/" ? "" : layer.path
      console.log(`print:  ${method} ${path}`)
    }

    if (layer.stack) {
      layer.stack.forEach((sublayer: any) => {
        if (sublayer.router) {
          sublayer.router.stack.forEach((routerLayer: any) => {
            printRoutes(routerLayer, prefix + (layer.path === "/" ? "" : layer.path))
          })
        }
      })
    }
  }

  // apiRouter.stack.forEach((layer: any) => {
  //   printRoutes(layer, config.apiPrefix)
  // })
  return app
}
