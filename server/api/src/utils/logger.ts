import winston from "winston"
import DailyRotateFile from "winston-daily-rotate-file"
import { config } from "../config"

// 自定义日志格式
const logFormat = winston.format.combine(
  winston.format.timestamp({ format: "YYYY-MM-DD HH:mm:ss" }),
  winston.format.errors({ stack: true }),
  winston.format.splat(),
  winston.format.printf(({ timestamp, level, message, stack, ...meta }) => {
    let log = `${timestamp} [${level.toUpperCase()}]: ${message}`

    if (Object.keys(meta).length > 0) {
      log += ` ${JSON.stringify(meta)}`
    }

    if (stack) {
      log += `\n${stack}`
    }

    return log
  })
)

// 控制台输出格式（带颜色）
const consoleFormat = winston.format.combine(
  winston.format.colorize(),
  winston.format.timestamp({ format: "HH:mm:ss" }),
  winston.format.printf(({ timestamp, level, message }) => {
    return `${timestamp} ${level}: ${message}`
  })
)

// 创建日志传输器
const transports: winston.transport[] = [
  // 控制台输出
  new winston.transports.Console({
    format: consoleFormat,
    level: config.log.level,
  }),
]

// 生产环境添加文件输出
if (config.isProduction) {
  // 错误日志
  transports.push(
    new DailyRotateFile({
      filename: `${config.log.dir}/error-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      level: "error",
      maxSize: "20m",
      maxFiles: "14d",
      format: logFormat,
    })
  )

  // 所有日志
  transports.push(
    new DailyRotateFile({
      filename: `${config.log.dir}/combined-%DATE%.log`,
      datePattern: "YYYY-MM-DD",
      maxSize: "20m",
      maxFiles: "14d",
      format: logFormat,
    })
  )
}

// 创建 Logger 实例
export const logger = winston.createLogger({
  level: config.log.level,
  format: logFormat,
  transports,
  exitOnError: false,
})

// 请求日志中间件
export const requestLogger = (message: string, meta?: Record<string, any>) => {
  logger.info(message, meta)
}

// 错误日志
export const errorLogger = (message: string, error?: Error, meta?: Record<string, any>) => {
  logger.error(message, { error: error?.message, stack: error?.stack, ...meta })
}

// HTTP 请求日志格式化
export const formatHttpLog = (method: string, url: string, status: number, duration: number) => {
  return `${method} ${url} ${status} - ${duration}ms`
}
