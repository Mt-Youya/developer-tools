import { createApp } from "./app.ts"
import { config } from "./config"
import { closePool, testConnection } from "./db/connection"
import { redis } from "./redis/connection"
import { logger } from "./utils/logger"

async function bootstrap() {
  try {
    // 测试数据库连接
    logger.info("Testing database connection...")
    const connected = await testConnection()

    if (!connected) {
      logger.error("Failed to connect to database")
      process.exit(1)
    }

    // 初始化 Redis 连接
    await redis.connect()
    console.log("✅ Redis connected successfully")

    // 创建应用
    const app = createApp()

    // 启动服务器
    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server is running on port ${config.port}`)
      logger.info(`📝 Environment: ${config.env}`)
      logger.info(`🔗 API: http://localhost:${config.port}${config.apiPrefix}`)
      logger.info(`❤️  Health: http://localhost:${config.port}${config.apiPrefix}/health`)
    })

    // 优雅关闭
    const shutdown = async (signal: string) => {
      logger.info(`${signal} received, shutting down gracefully...`)

      server.close(async () => {
        logger.info("HTTP server closed")

        try {
          await closePool()
          logger.info("✅ Graceful shutdown completed")
          process.exit(0)
        } catch (error) {
          logger.error("Error during shutdown:", error as Error)
          process.exit(1)
        }
      })

      // 强制关闭超时
      setTimeout(() => {
        logger.error("Forced shutdown after timeout")
        process.exit(1)
      }, 10000)
    }

    // 监听退出信号
    process.on("SIGTERM", () => shutdown("SIGTERM"))
    process.on("SIGINT", () => shutdown("SIGINT"))

    // 未捕获异常处理
    process.on("uncaughtException", (error) => {
      logger.error("Uncaught Exception:", error)
      shutdown("uncaughtException")
    })

    process.on("unhandledRejection", (reason, promise) => {
      logger.error("Unhandled Rejection:", reason as Error, {
        promise: String(promise),
      })
    })
  } catch (error) {
    logger.error("Failed to start server:", error as Error)
    process.exit(1)
  }
}

// 启动应用
bootstrap()
