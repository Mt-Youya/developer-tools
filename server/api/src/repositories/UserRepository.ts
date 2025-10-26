import { queryMany, queryOne } from "../db/connection"
import { BaseRepository } from "./BaseRepository"

export interface User {
  id: number
  email: string
  password_hash: string
  name: string
  role: "admin" | "user" | "guest"
  avatar_url?: string
  is_active: boolean
  email_verified: boolean
  last_login_at?: Date
  created_at: Date
  updated_at: Date
}

export class UserRepository extends BaseRepository<User> {
  constructor() {
    super("users")
  }

  // 根据邮箱查找用户
  async findByEmail(email: string): Promise<User | null> {
    return queryOne<User>("SELECT * FROM users WHERE email = $1", [email])
  }

  // 查找活跃用户
  async findActiveUsers(): Promise<User[]> {
    return queryMany<User>("SELECT * FROM users WHERE is_active = true ORDER BY created_at DESC")
  }

  // 根据角色查找用户
  async findByRole(role: User["role"]): Promise<User[]> {
    return queryMany<User>("SELECT * FROM users WHERE role = $1 ORDER BY created_at DESC", [role])
  }

  // 更新最后登录时间
  async updateLastLogin(id: number): Promise<void> {
    await queryOne("UPDATE users SET last_login_at = CURRENT_TIMESTAMP WHERE id = $1", [id])
  }

  // 验证邮箱
  async verifyEmail(id: number): Promise<User | null> {
    return queryOne<User>("UPDATE users SET email_verified = true WHERE id = $1 RETURNING *", [id])
  }

  // 更新密码
  async updatePassword(id: number, passwordHash: string): Promise<void> {
    await queryOne("UPDATE users SET password_hash = $1 WHERE id = $2", [passwordHash, id])
  }

  // 搜索用户（按名字或邮箱）
  async search(keyword: string, limit: number = 20): Promise<User[]> {
    return queryMany<User>(
      `SELECT * FROM users 
       WHERE name ILIKE $1 OR email ILIKE $1 
       ORDER BY created_at DESC 
       LIMIT $2`,
      [`%${keyword}%`, limit]
    )
  }

  // 获取用户统计信息
  async getStats(): Promise<{
    total: number
    active: number
    verified: number
    byRole: Record<string, number>
  }> {
    const totalResult = await queryOne<{ count: string }>("SELECT COUNT(*) as count FROM users")

    const activeResult = await queryOne<{ count: string }>("SELECT COUNT(*) as count FROM users WHERE is_active = true")

    const verifiedResult = await queryOne<{ count: string }>(
      "SELECT COUNT(*) as count FROM users WHERE email_verified = true"
    )

    const roleResults = await queryMany<{ role: string; count: string }>(
      "SELECT role, COUNT(*) as count FROM users GROUP BY role"
    )

    return {
      total: parseInt(totalResult?.count || "0", 10),
      active: parseInt(activeResult?.count || "0", 10),
      verified: parseInt(verifiedResult?.count || "0", 10),
      byRole: roleResults.reduce(
        (acc, r) => {
          acc[r.role] = parseInt(r.count, 10)
          return acc
        },
        {} as Record<string, number>
      ),
    }
  }
}

// 导出单例
export const userRepository = new UserRepository()
