import { query, queryOne } from "../db/connection"
import { userRepository } from "../repositories/UserRepository"
import { AppError, AuthenticationError } from "../utils/errors"
import { generateTokenPair, type JwtPayload, verifyRefreshToken } from "../utils/jwt"
import { comparePassword, hashPassword } from "../utils/password"
import type { UserResponse } from "./user.service"

export interface LoginDto {
  email: string
  password: string
}

export interface RegisterDto {
  email: string
  password: string
  name: string
}

export interface AuthResponse {
  user: UserResponse
  tokens: {
    accessToken: string
    refreshToken: string
  }
}

interface Session {
  id: number
  user_id: number
  refresh_token: string
  ip_address?: string
  user_agent?: string
  expires_at: Date
  created_at: Date
}

class AuthService {
  // 注册
  async register(dto: RegisterDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // 检查邮箱是否已存在
    const existing = await userRepository.findByEmail(dto.email)
    if (existing) {
      throw new AppError("Email already exists", 409)
    }

    // 加密密码
    const passwordHash = await hashPassword(dto.password)

    // 创建用户
    const user = await userRepository.create({
      email: dto.email,
      password_hash: passwordHash,
      name: dto.name,
      role: "user",
      is_active: true,
      email_verified: false,
    })

    // 生成令牌
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // 保存 refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken, ipAddress, userAgent)

    // 移除密码字段
    const { password_hash, ...userResponse } = user

    return {
      user: userResponse,
      tokens,
    }
  }

  // 登录
  async login(dto: LoginDto, ipAddress?: string, userAgent?: string): Promise<AuthResponse> {
    // 查找用户
    const user = await userRepository.findByEmail(dto.email)
    if (!user) {
      throw new AuthenticationError("Invalid email or password")
    }

    // 检查用户是否激活
    if (!user.is_active) {
      throw new AuthenticationError("Account is disabled")
    }

    // 验证密码
    const isValid = await comparePassword(dto.password, user.password_hash)
    if (!isValid) {
      throw new AuthenticationError("Invalid email or password")
    }

    // 生成令牌
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // 保存 refresh token
    await this.saveRefreshToken(user.id, tokens.refreshToken, ipAddress, userAgent)

    // 更新最后登录时间
    await userRepository.updateLastLogin(user.id)

    // 移除密码字段
    const { password_hash, ...userResponse } = user

    return {
      user: userResponse,
      tokens,
    }
  }

  // 刷新令牌
  async refreshToken(refreshToken: string): Promise<{ accessToken: string; refreshToken: string }> {
    // 验证 refresh token
    let payload: JwtPayload
    try {
      payload = verifyRefreshToken(refreshToken)
    } catch (error) {
      throw new AuthenticationError("Invalid refresh token")
    }

    // 检查 refresh token 是否在数据库中
    const session = await queryOne<Session>("SELECT * FROM sessions WHERE refresh_token = $1 AND expires_at > NOW()", [
      refreshToken,
    ])

    if (!session) {
      throw new AuthenticationError("Refresh token not found or expired")
    }

    // 检查用户是否存在且激活
    const user = await userRepository.findById(payload.userId)
    if (!user || !user.is_active) {
      throw new AuthenticationError("User not found or inactive")
    }

    // 生成新的令牌对
    const tokens = generateTokenPair({
      userId: user.id,
      email: user.email,
      role: user.role,
    })

    // 更新数据库中的 refresh token
    await query("UPDATE sessions SET refresh_token = $1, expires_at = NOW() + INTERVAL '30 days' WHERE id = $2", [
      tokens.refreshToken,
      session.id,
    ])

    return tokens
  }

  // 登出
  async logout(refreshToken: string): Promise<void> {
    await query("DELETE FROM sessions WHERE refresh_token = $1", [refreshToken])
  }

  // 登出所有设备
  async logoutAll(userId: number): Promise<void> {
    await query("DELETE FROM sessions WHERE user_id = $1", [userId])
  }

  // 保存 refresh token
  private async saveRefreshToken(
    userId: number,
    refreshToken: string,
    ipAddress?: string,
    userAgent?: string
  ): Promise<void> {
    await query(
      `INSERT INTO sessions (user_id, refresh_token, ip_address, user_agent, expires_at)
       VALUES ($1, $2, $3, $4, NOW() + INTERVAL '30 days')`,
      [userId, refreshToken, ipAddress, userAgent]
    )
  }

  // 获取用户的所有会话
  async getUserSessions(userId: number): Promise<Session[]> {
    return query<Session>("SELECT * FROM sessions WHERE user_id = $1 AND expires_at > NOW() ORDER BY created_at DESC", [
      userId,
    ]).then((result) => result.rows)
  }

  // 删除过期的会话
  async cleanupExpiredSessions(): Promise<number> {
    const result = await query("DELETE FROM sessions WHERE expires_at <= NOW()")
    return result.rowCount ?? 0
  }
}

export const authService = new AuthService()
