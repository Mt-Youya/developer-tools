import type { Context } from "koa"
import type { CreateUserDto, UpdateUserDto } from "../services/user.service"
import { userService } from "../services/user.service"

export const userController = {
  // 获取所有用户（分页）
  async getAll(ctx: Context) {
    const page = parseInt(ctx.query.page as string) || 1
    const pageSize = parseInt(ctx.query.pageSize as string) || 10

    const result = await userService.findAll({ page, pageSize })

    ctx.body = {
      success: true,
      data: result,
    }
  },

  // 获取单个用户
  async getById(ctx: Context) {
    const id = parseInt(ctx.params.id)

    const user = await userService.findById(id)

    ctx.body = {
      success: true,
      data: user,
    }
  },

  // 创建用户
  async create(ctx: Context) {
    const dto = ctx.request.body as CreateUserDto

    const user = await userService.create(dto)

    ctx.status = 201
    ctx.body = {
      success: true,
      data: user,
      message: "User created successfully",
    }
  },

  // 更新用户
  async update(ctx: Context) {
    const id = parseInt(ctx.params.id)
    const dto = ctx.request.body as UpdateUserDto

    const user = await userService.update(id, dto)

    ctx.body = {
      success: true,
      data: user,
      message: "User updated successfully",
    }
  },

  // 删除用户
  async delete(ctx: Context) {
    const id = parseInt(ctx.params.id)

    await userService.delete(id)

    ctx.status = 204
  },

  // 更改密码
  async changePassword(ctx: Context) {
    const id = parseInt(ctx.params.id)
    const { oldPassword, newPassword } = ctx.request.body as {
      oldPassword: string
      newPassword: string
    }

    await userService.changePassword(id, oldPassword, newPassword)

    ctx.body = {
      success: true,
      message: "Password changed successfully",
    }
  },

  // 搜索用户
  async search(ctx: Context) {
    const keyword = ctx.query.q as string

    if (!keyword) {
      ctx.status = 400
      ctx.body = {
        success: false,
        error: "Search keyword is required",
      }
      return
    }

    const users = await userService.search(keyword)

    ctx.body = {
      success: true,
      data: users,
    }
  },

  // 获取用户统计
  async getStats(ctx: Context) {
    const stats = await userService.getStats()

    ctx.body = {
      success: true,
      data: stats,
    }
  },
}
