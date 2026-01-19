import Router from "@koa/router"
import Koa from "koa"
import bodyParser from "koa-bodyparser"
import compress from "koa-compress"
import helmet from "koa-helmet"
import { config } from "./config"
import { cacheMiddleware } from "./middlewares/cache"
import { errorHandler } from "./middlewares/errorHandler"
import { loggerMiddleware } from "./middlewares/logger"
import { rateLimitMiddleware } from "./middlewares/rateLimit"
import { fedoRouter } from "./routes/fedo.routes"
import { gamesRouter } from "./routes/games.routes"
import { musicRouter } from "./routes/music.routes"
import { waybillRouter } from "./routes/waybill.routes"
import { logger } from "./utils/logger"

export function createApp() {
  const app = new Koa()

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
      enableTypes: ["json", "form"],
      jsonLimit: "10mb",
      formLimit: "10mb",
      textLimit: "10mb",
    })
  )

  // Redis 相关中间件
  // app.use(rateLimitMiddleware(600000, 3600))
  // app.use(cacheMiddleware(300))

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
  apiRouter.use("/waybill", waybillRouter.routes(), waybillRouter.allowedMethods())
  apiRouter.use("/fedo", fedoRouter.routes(), fedoRouter.allowedMethods())

  // apiRouter.use("/auth", authRouter.routes(), authRouter.allowedMethods())
  // apiRouter.use("/users", userRouter.routes(), userRouter.allowedMethods())

  // 挂载 API 路由
  app.use(apiRouter.routes())
  app.use(apiRouter.allowedMethods())

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

  app.on("error", (err, ctx) => {
    logger.error("Unhandled error:", err, {
      url: ctx?.url,
      method: ctx?.method,
    })
  })

  console.log("📋 Registered routes:")
  function _printRoutes(layer: any, prefix: string = "") {
    if (layer.methods && layer.methods.length > 0) {
      const method = layer.methods.join(",").toUpperCase()
      const path = layer.path === "/" ? "" : layer.path
      console.log(`print:  ${method} ${path}`)
    }

    if (layer.stack) {
      layer.stack.forEach((sublayer: any) => {
        if (sublayer.router) {
          sublayer.router.stack.forEach((routerLayer: any) => {
            _printRoutes(routerLayer, prefix + (layer.path === "/" ? "" : layer.path))
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
