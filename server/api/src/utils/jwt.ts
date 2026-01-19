import jwt, { type Secret, type SignOptions } from "jsonwebtoken"
import { config } from "../config"
import { AppError } from "./errors"

export interface JwtPayload {
  userId: number
  email: string
  role: string
}

export interface TokenPair {
  accessToken: string
  refreshToken: string
}

// 生成访问令牌
export function generateAccessToken(payload: JwtPayload): string {
  // Explicitly cast options to match SignOptions interface to avoid TS overload errors
  const options: SignOptions = {
    expiresIn: config.jwt.expiresIn as SignOptions["expiresIn"],
  }
  return jwt.sign(payload, config.jwt.secret as Secret, options)
}

// 生成刷新令牌
export function generateRefreshToken(payload: JwtPayload): string {
  const options: SignOptions = {
    expiresIn: config.jwt.refreshExpiresIn as SignOptions["expiresIn"],
  }
  return jwt.sign(payload, config.jwt.refreshSecret as Secret, options)
}

// 生成令牌对
export function generateTokenPair(payload: JwtPayload): TokenPair {
  return {
    accessToken: generateAccessToken(payload),
    refreshToken: generateRefreshToken(payload),
  }
}

// 验证访问令牌
export function verifyAccessToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, config.jwt.secret as Secret) as JwtPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Token expired", 401)
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid token", 401)
    }
    throw error
  }
}

// 验证刷新令牌
export function verifyRefreshToken(token: string): JwtPayload {
  try {
    return jwt.verify(token, config.jwt.refreshSecret as Secret) as JwtPayload
  } catch (error) {
    if (error instanceof jwt.TokenExpiredError) {
      throw new AppError("Refresh token expired", 401)
    }
    if (error instanceof jwt.JsonWebTokenError) {
      throw new AppError("Invalid refresh token", 401)
    }
    throw error
  }
}

// 解码令牌（不验证）
export function decodeToken(token: string): JwtPayload | null {
  try {
    return jwt.decode(token) as JwtPayload
  } catch {
    return null
  }
}
