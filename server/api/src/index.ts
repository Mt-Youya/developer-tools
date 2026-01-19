import { createApp } from "./app"
import { config } from "./config"
import { closePool, testConnection } from "./db/connection"
import { redis } from "./redis/connection"
import { logger } from "./utils/logger"

// import "./utils/checkProcess"

async function bootstrap() {
  try {
    logger.info("Testing database connection...")
    const connected = await testConnection()

    if (!connected) {
      logger.error("Failed to connect to database")
      process.exit(1)
    }

    await redis.connect()
    console.log("✅ Redis connected successfully")

    const app = createApp()

    const server = app.listen(config.port, () => {
      logger.info(`🚀 Server is running on port ${config.port}`)
      logger.info(`📝 Environment: ${config.env}`)
      logger.info(`🔗 API: http://localhost:${config.port}${config.apiPrefix}`)
      logger.info(`❤️  Health: http://localhost:${config.port}${config.apiPrefix}/health`)
    })

    async function shutdown(signal: string) {
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

      const timer = setTimeout(() => {
        logger.error("Forced shutdown after timeout")
        clearTimeout(timer)
        process.exit(1)
      }, 10000)
    }

    process.on("SIGTERM", () => shutdown("SIGTERM"))
    process.on("SIGINT", () => shutdown("SIGINT"))

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
