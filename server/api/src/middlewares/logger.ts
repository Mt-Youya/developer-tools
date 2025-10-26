import type { Context, Next } from "koa"
import { formatHttpLog, logger } from "../utils/logger.js"

export async function loggerMiddleware(ctx: Context, next: Next) {
  const start = Date.now()

  // 记录请求
  logger.info(`→ ${ctx.method} ${ctx.url}`, {
    ip: ctx.ip,
    userAgent: ctx.headers["user-agent"],
  })

  try {
    await next()
  } finally {
    const duration = Date.now() - start
    const logMessage = formatHttpLog(ctx.method, ctx.url, ctx.status, duration)

    // 根据状态码选择日志级别
    if (ctx.status >= 500) {
      logger.error(logMessage)
    } else if (ctx.status >= 400) {
      logger.warn(logMessage)
    } else {
      logger.info(logMessage)
    }
  }
}
