import { query, queryMany, queryOne } from "../db/connection"

export interface PaginationParams {
  page: number
  pageSize: number
}

export interface PaginationResult<T> {
  data: T[]
  total: number
  page: number
  pageSize: number
  totalPages: number
}

export abstract class BaseRepository<T> {
  constructor(protected tableName: string) {}

  // 查找所有记录
  async findAll(): Promise<T[]> {
    return queryMany<T>(`SELECT * FROM ${this.tableName}`)
  }

  // 分页查询
  async findPaginated(params: PaginationParams): Promise<PaginationResult<T>> {
    const { page, pageSize } = params
    const offset = (page - 1) * pageSize

    // 获取总数
    const countResult = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM ${this.tableName}`)
    const total = parseInt(countResult?.count || "0", 10)

    // 获取数据
    const data = await queryMany<T>(`SELECT * FROM ${this.tableName} ORDER BY id DESC LIMIT $1 OFFSET $2`, [
      pageSize,
      offset,
    ])

    return {
      data,
      total,
      page,
      pageSize,
      totalPages: Math.ceil(total / pageSize),
    }
  }

  // 根据 ID 查找
  async findById(id: number): Promise<T | null> {
    return queryOne<T>(`SELECT * FROM ${this.tableName} WHERE id = $1`, [id])
  }

  // 根据条件查找单条记录
  async findOne(conditions: Partial<T>): Promise<T | null> {
    const { whereClause, values } = this.buildWhereClause(conditions)
    return queryOne<T>(`SELECT * FROM ${this.tableName} ${whereClause}`, values)
  }

  // 根据条件查找多条记录
  async findMany(conditions: Partial<T>): Promise<T[]> {
    const { whereClause, values } = this.buildWhereClause(conditions)
    return queryMany<T>(`SELECT * FROM ${this.tableName} ${whereClause}`, values)
  }

  // 创建记录
  async create(data: Omit<T, "id" | "created_at" | "updated_at">): Promise<T> {
    const keys = Object.keys(data)
    const values = Object.values(data)
    const placeholders = keys.map((_, i) => `${i + 1}`).join(", ")

    const result = await queryOne<T>(
      `INSERT INTO ${this.tableName} (${keys.join(", ")}) 
       VALUES (${placeholders}) 
       RETURNING *`,
      values
    )

    if (!result) {
      throw new Error("Failed to create record")
    }

    return result
  }

  // 更新记录
  async update(id: number, data: Partial<T>): Promise<T | null> {
    const keys = Object.keys(data)
    const values = Object.values(data)

    if (keys.length === 0) {
      return this.findById(id)
    }

    const setClause = keys.map((key, i) => `${key} = ${i + 1}`).join(", ")

    return queryOne<T>(
      `UPDATE ${this.tableName} 
       SET ${setClause} 
       WHERE id = ${keys.length + 1} 
       RETURNING *`,
      [...values, id]
    )
  }

  // 删除记录
  async delete(id: number): Promise<boolean> {
    const result = await query(`DELETE FROM ${this.tableName} WHERE id = $1`, [id])
    return (result.rowCount ?? 0) > 0
  }

  // 批量删除
  async deleteMany(ids: number[]): Promise<number> {
    if (ids.length === 0) return 0

    const placeholders = ids.map((_, i) => `${i + 1}`).join(", ")
    const result = await query(`DELETE FROM ${this.tableName} WHERE id IN (${placeholders})`, ids)
    return result.rowCount ?? 0
  }

  // 检查记录是否存在
  async exists(id: number): Promise<boolean> {
    const result = await queryOne<{ exists: boolean }>(`SELECT EXISTS(SELECT 1 FROM ${this.tableName} WHERE id = $1)`, [
      id,
    ])
    return result?.exists ?? false
  }

  // 统计记录数
  async count(conditions?: Partial<T>): Promise<number> {
    if (!conditions || Object.keys(conditions).length === 0) {
      const result = await queryOne<{ count: string }>(`SELECT COUNT(*) as count FROM ${this.tableName}`)
      return parseInt(result?.count || "0", 10)
    }

    const { whereClause, values } = this.buildWhereClause(conditions)
    const result = await queryOne<{ count: string }>(
      `SELECT COUNT(*) as count FROM ${this.tableName} ${whereClause}`,
      values
    )
    return parseInt(result?.count || "0", 10)
  }

  // 构建 WHERE 子句
  protected buildWhereClause(conditions: Partial<T>): {
    whereClause: string
    values: any[]
  } {
    const keys = Object.keys(conditions)

    if (keys.length === 0) {
      return { whereClause: "", values: [] }
    }

    const whereParts = keys.map((key, i) => `${key} = ${i + 1}`)
    const whereClause = `WHERE ${whereParts.join(" AND ")}`
    const values = Object.values(conditions)

    return { whereClause, values }
  }
}
