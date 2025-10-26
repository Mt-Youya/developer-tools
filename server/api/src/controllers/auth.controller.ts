import type { Context } from "koa"
import type { LoginDto, RegisterDto } from "../services/auth.service"
import { authService } from "../services/auth.service"

export const authController = {
  // 注册
  async register(ctx: Context) {
    const dto = ctx.request.body as RegisterDto
    const ipAddress = ctx.ip
    const userAgent = ctx.headers["user-agent"]

    const result = await authService.register(dto, ipAddress, userAgent)

    ctx.status = 201
    ctx.body = {
      success: true,
      data: result,
      message: "Registration successful",
    }
  },

  // 登录
  async login(ctx: Context) {
    const dto = ctx.request.body as LoginDto
    const ipAddress = ctx.ip
    const userAgent = ctx.headers["user-agent"]

    const result = await authService.login(dto, ipAddress, userAgent)

    ctx.body = {
      success: true,
      data: result,
      message: "Login successful",
    }
  },

  // 刷新令牌
  async refreshToken(ctx: Context) {
    const { refreshToken } = ctx.request.body as { refreshToken: string }

    if (!refreshToken) {
      ctx.status = 400
      ctx.body = {
        success: false,
        error: "Refresh token is required",
      }
      return
    }

    const tokens = await authService.refreshToken(refreshToken)

    ctx.body = {
      success: true,
      data: tokens,
      message: "Token refreshed successfully",
    }
  },

  // 登出
  async logout(ctx: Context) {
    const { refreshToken } = ctx.request.body as { refreshToken: string }

    if (!refreshToken) {
      ctx.status = 400
      ctx.body = {
        success: false,
        error: "Refresh token is required",
      }
      return
    }

    await authService.logout(refreshToken)

    ctx.body = {
      success: true,
      message: "Logout successful",
    }
  },

  // 登出所有设备
  async logoutAll(ctx: Context) {
    const userId = ctx.user!.userId

    await authService.logoutAll(userId)

    ctx.body = {
      success: true,
      message: "Logged out from all devices",
    }
  },

  // 获取当前用户信息
  async me(ctx: Context) {
    const userId = ctx.user!.userId

    const { userService } = await import("../services/user.service.js")
    const user = await userService.findById(userId)

    ctx.body = {
      success: true,
      data: user,
    }
  },

  // 获取用户的所有会话
  async getSessions(ctx: Context) {
    const userId = ctx.user!.userId

    const sessions = await authService.getUserSessions(userId)

    ctx.body = {
      success: true,
      data: sessions,
    }
  },
}
