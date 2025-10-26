import pg from "pg"
import { config } from "../config"
import { logger } from "../utils/logger"

const { Pool } = pg

// 创建数据库连接池
export const pool = new Pool({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
  password: config.db.password,
  min: config.db.poolMin,
  max: config.db.poolMax,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
})

// 连接事件监听
pool.on("connect", () => {
  logger.info("New database client connected")
})

pool.on("acquire", () => {
  logger.debug("Client acquired from pool")
})

pool.on("remove", () => {
  logger.debug("Client removed from pool")
})

pool.on("error", (err) => {
  logger.error("Unexpected database error on idle client", { error: err.message })
})

// 测试数据库连接
export async function testConnection(): Promise<boolean> {
  try {
    const client = await pool.connect()
    const result = await client.query("SELECT NOW()")
    client.release()

    logger.info("✅ Database connection successful", {
      timestamp: result.rows[0].now,
      database: config.db.database,
    })

    return true
  } catch (error) {
    logger.error("❌ Database connection failed", error as Error)
    return false
  }
}

// 查询辅助函数
export async function query<T = any>(text: string, params?: any[]): Promise<pg.QueryResult<T>> {
  const start = Date.now()

  try {
    const result = await pool.query<T>(text, params)
    const duration = Date.now() - start

    logger.debug("Query executed", {
      text: text.substring(0, 100),
      duration: `${duration}ms`,
      rows: result.rowCount,
    })

    return result
  } catch (error) {
    const duration = Date.now() - start
    logger.error("Query error", error as Error, {
      text: text.substring(0, 100),
      params,
      duration: `${duration}ms`,
    })
    throw error
  }
}

// 获取单行数据
export async function queryOne<T = any>(text: string, params?: any[]): Promise<T | null> {
  const result = await query<T>(text, params)
  return result.rows[0] || null
}

// 获取多行数据
export async function queryMany<T = any>(text: string, params?: any[]): Promise<T[]> {
  const result = await query<T>(text, params)
  return result.rows
}

// 事务辅助函数
export async function transaction<T>(callback: (client: pg.PoolClient) => Promise<T>): Promise<T> {
  const client = await pool.connect()

  try {
    await client.query("BEGIN")
    logger.debug("Transaction started")

    const result = await callback(client)

    await client.query("COMMIT")
    logger.debug("Transaction committed")

    return result
  } catch (error) {
    await client.query("ROLLBACK")
    logger.error("Transaction rolled back", error as Error)
    throw error
  } finally {
    client.release()
  }
}

// 批量插入
export async function batchInsert<T = any>(table: string, columns: string[], values: any[][]): Promise<void> {
  if (values.length === 0) return

  const placeholders = values
    .map((_, i) => {
      const start = i * columns.length + 1
      const params = Array.from({ length: columns.length }, (_, j) => `$${start + j}`)
      return `(${params.join(", ")})`
    })
    .join(", ")

  const text = `INSERT INTO ${table} (${columns.join(", ")}) VALUES ${placeholders}`
  const params = values.flat()

  await query(text, params)
}

// 优雅关闭连接池
export async function closePool(): Promise<void> {
  try {
    await pool.end()
    logger.info("Database pool closed gracefully")
  } catch (error) {
    logger.error("Error closing database pool", error as Error)
    throw error
  }
}

// 获取连接池状态
export function getPoolStats() {
  return {
    total: pool.totalCount,
    idle: pool.idleCount,
    waiting: pool.waitingCount,
  }
}
