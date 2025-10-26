import type { Context, Next } from "koa"
import { config } from "../config"
import { AppError } from "../utils/errors"
import { logger } from "../utils/logger"

export async function errorHandler(ctx: Context, next: Next) {
  try {
    await next()
  } catch (error) {
    // 默认错误信息
    let statusCode = 500
    let message = "Internal server error"
    let code = "INTERNAL_ERROR"
    let details: any

    // 处理自定义错误
    if (error instanceof AppError) {
      statusCode = error.statusCode
      message = error.message
      code = error.code || "APP_ERROR"
      details = error.details
    }
    // 处理 Zod 验证错误
    else if (error && typeof error === "object" && "name" in error && error.name === "ZodError") {
      statusCode = 400
      message = "Validation failed"
      code = "VALIDATION_ERROR"
      details = (error as any).errors
    }
    // 处理数据库错误
    else if (error && typeof error === "object" && "code" in error) {
      const dbError = error as any
      if (dbError.code === "23505") {
        // unique violation
        statusCode = 409
        message = "Resource already exists"
        code = "DUPLICATE_ERROR"
      } else if (dbError.code === "23503") {
        // foreign key violation
        statusCode = 400
        message = "Invalid reference"
        code = "FOREIGN_KEY_ERROR"
      }
    }
    // 未知错误
    else if (error instanceof Error) {
      message = config.isDevelopment ? error.message : "Internal server error"
    }

    // 记录错误日志
    if (statusCode >= 500) {
      logger.error("Server error:", error as Error, {
        method: ctx.method,
        url: ctx.url,
        statusCode,
      })
    } else if (statusCode >= 400) {
      logger.warn("Client error:", {
        method: ctx.method,
        url: ctx.url,
        statusCode,
        message,
      })
    }

    // 设置响应
    ctx.status = statusCode
    ctx.body = {
      success: false,
      error: {
        message,
        code,
        ...(details && { details }),
        ...(config.isDevelopment && error instanceof Error && { stack: error.stack }),
      },
    }
  }
}
