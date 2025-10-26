import type { PaginationParams, PaginationResult } from "../repositories/BaseRepository"
import { type User, userRepository } from "../repositories/UserRepository"
import { AppError } from "../utils/errors"
import { comparePassword, hashPassword } from "../utils/password"

export interface CreateUserDto {
  email: string
  password: string
  name: string
  role?: "admin" | "user" | "guest"
}

export interface UpdateUserDto {
  name?: string
  email?: string
  role?: "admin" | "user" | "guest"
  avatar_url?: string
  is_active?: boolean
}

export interface UserResponse extends Omit<User, "password_hash"> {}

class UserService {
  // 移除密码字段
  private sanitizeUser(user: User): UserResponse {
    const { password_hash, ...sanitized } = user
    return sanitized
  }

  // 获取所有用户（分页）
  async findAll(params: PaginationParams): Promise<PaginationResult<UserResponse>> {
    const result = await userRepository.findPaginated(params)

    return {
      ...result,
      data: result.data.map((u) => this.sanitizeUser(u)),
    }
  }

  // 根据 ID 获取用户
  async findById(id: number): Promise<UserResponse> {
    const user = await userRepository.findById(id)

    if (!user) {
      throw new AppError("User not found", 404)
    }

    return this.sanitizeUser(user)
  }

  // 根据邮箱获取用户
  async findByEmail(email: string): Promise<UserResponse | null> {
    const user = await userRepository.findByEmail(email)
    return user ? this.sanitizeUser(user) : null
  }

  // 创建用户
  async create(dto: CreateUserDto): Promise<UserResponse> {
    // 检查邮箱是否已存在
    const existing = await userRepository.findByEmail(dto.email)
    if (existing) {
      throw new AppError("Email already exists", 409)
    }

    // 密码加密
    const passwordHash = await hashPassword(dto.password)

    // 创建用户
    const user = await userRepository.create({
      email: dto.email,
      password_hash: passwordHash,
      name: dto.name,
      role: dto.role || "user",
      is_active: true,
      email_verified: false,
    })

    return this.sanitizeUser(user)
  }

  // 更新用户
  async update(id: number, dto: UpdateUserDto): Promise<UserResponse> {
    // 检查用户是否存在
    const existing = await userRepository.findById(id)
    if (!existing) {
      throw new AppError("User not found", 404)
    }

    // 如果更新邮箱，检查是否已被使用
    if (dto.email && dto.email !== existing.email) {
      const emailExists = await userRepository.findByEmail(dto.email)
      if (emailExists) {
        throw new AppError("Email already exists", 409)
      }
    }

    const updated = await userRepository.update(id, dto)

    if (!updated) {
      throw new AppError("Failed to update user", 500)
    }

    return this.sanitizeUser(updated)
  }

  // 删除用户
  async delete(id: number): Promise<void> {
    const deleted = await userRepository.delete(id)

    if (!deleted) {
      throw new AppError("User not found", 404)
    }
  }

  // 更改密码
  async changePassword(id: number, oldPassword: string, newPassword: string): Promise<void> {
    const user = await userRepository.findById(id)

    if (!user) {
      throw new AppError("User not found", 404)
    }

    // 验证旧密码
    const isValid = await comparePassword(oldPassword, user.password_hash)
    if (!isValid) {
      throw new AppError("Invalid old password", 400)
    }

    // 更新密码
    const newPasswordHash = await hashPassword(newPassword)
    await userRepository.updatePassword(id, newPasswordHash)
  }

  // 验证邮箱
  async verifyEmail(id: number): Promise<UserResponse> {
    const user = await userRepository.verifyEmail(id)

    if (!user) {
      throw new AppError("User not found", 404)
    }

    return this.sanitizeUser(user)
  }

  // 搜索用户
  async search(keyword: string): Promise<UserResponse[]> {
    const users = await userRepository.search(keyword)
    return users.map((u) => this.sanitizeUser(u))
  }

  // 获取用户统计
  async getStats() {
    return userRepository.getStats()
  }

  // 更新最后登录时间
  async updateLastLogin(id: number): Promise<void> {
    await userRepository.updateLastLogin(id)
  }
}

export const userService = new UserService()
