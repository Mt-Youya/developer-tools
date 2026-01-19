import type { Context, Next } from "koa"
import { AppError, AuthenticationError, AuthorizationError } from "../utils/errors"
import { type JwtPayload, verifyAccessToken } from "../utils/jwt"

// 扩展 Koa Context 类型
declare module "koa" {
  interface Context {
    user?: JwtPayload
  }
}

// JWT 认证中间件
export async function authenticate(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization

  if (!authHeader) {
    throw new AuthenticationError("No authorization header")
  }

  const parts = authHeader.split(" ")

  if (parts.length !== 2 || parts[0] !== "Bearer") {
    throw new AuthenticationError("Invalid authorization header format")
  }

  const token = parts[1]

  try {
    const payload = verifyAccessToken(token)
    ctx.user = payload
    await next()
  } catch (error) {
    if (error instanceof AppError) {
      throw error
    }
    throw new AuthenticationError("Invalid token")
  }
}

// 可选认证（不强制要求登录）
export async function optionalAuth(ctx: Context, next: Next) {
  const authHeader = ctx.headers.authorization

  if (authHeader) {
    const parts = authHeader.split(" ")

    if (parts.length === 2 && parts[0] === "Bearer") {
      try {
        const payload = verifyAccessToken(parts[1])
        ctx.user = payload
      } catch {
        // 忽略无效令牌
      }
    }
  }

  await next()
}

// 角色授权中间件
export function authorize(...allowedRoles: string[]) {
  return async (ctx: Context, next: Next) => {
    if (!ctx.user) {
      throw new AuthenticationError("Authentication required")
    }

    if (!allowedRoles.includes(ctx.user.role)) {
      throw new AuthorizationError(`Required role: ${allowedRoles.join(" or ")}`)
    }

    await next()
  }
}

// 检查是否是用户本人或管理员
export async function requireOwnerOrAdmin(ctx: Context, next: Next) {
  if (!ctx.user) {
    throw new AuthenticationError("Authentication required")
  }

  const targetUserId = parseInt(ctx.params.id || ctx.params.userId, 10)

  const isOwner = ctx.user.userId === targetUserId
  const isAdmin = ctx.user.role === "admin"

  if (!isOwner && !isAdmin) {
    throw new AuthorizationError("You can only access your own resources")
  }

  await next()
}
