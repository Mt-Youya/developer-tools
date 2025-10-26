import type { Context, Next } from "koa"
import { type ZodSchema, z } from "zod"
import { ValidationError } from "../utils/errors.js"

// 验证请求体
export function validateBody<T extends ZodSchema>(schema: T) {
  return async (ctx: Context, next: Next) => {
    try {
      ctx.request.body = schema.parse(ctx.request.body)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError("Validation failed", error.errors)
      }
      throw error
    }
  }
}

// 验证查询参数
export function validateQuery<T extends ZodSchema>(schema: T) {
  return async (ctx: Context, next: Next) => {
    try {
      ctx.query = schema.parse(ctx.query)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError("Query validation failed", error.errors)
      }
      throw error
    }
  }
}

// 验证路径参数
export function validateParams<T extends ZodSchema>(schema: T) {
  return async (ctx: Context, next: Next) => {
    try {
      ctx.params = schema.parse(ctx.params)
      await next()
    } catch (error) {
      if (error instanceof z.ZodError) {
        throw new ValidationError("Params validation failed", error.errors)
      }
      throw error
    }
  }
}
