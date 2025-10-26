import fs from "node:fs/promises"
import path from "node:path"
import { fileURLToPath } from "node:url"
import { logger } from "../utils/logger"
import { pool, query, testConnection } from "./connection"

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

// 创建迁移表
async function createMigrationTable() {
  await query(`
    CREATE TABLE IF NOT EXISTS migrations (
      id SERIAL PRIMARY KEY,
      name VARCHAR(255) UNIQUE NOT NULL,
      executed_at TIMESTAMPTZ DEFAULT CURRENT_TIMESTAMP
    )
  `)
}

// 获取已执行的迁移
async function getExecutedMigrations(): Promise<string[]> {
  const result = await query<{ name: string }>("SELECT name FROM migrations ORDER BY id")
  return result.rows.map((row) => row.name)
}

// 记录迁移
async function recordMigration(name: string) {
  await query("INSERT INTO migrations (name) VALUES ($1)", [name])
}

// 执行迁移
async function runMigrations() {
  try {
    // 测试连接
    const connected = await testConnection()
    if (!connected) {
      throw new Error("Database connection failed")
    }

    // 创建迁移表
    await createMigrationTable()
    logger.info("Migration table ready")

    // 读取迁移文件
    const migrationsDir = path.join(__dirname, "migrations")
    const files = await fs.readdir(migrationsDir)
    const sqlFiles = files.filter((f) => f.endsWith(".sql")).sort()

    if (sqlFiles.length === 0) {
      logger.info("No migration files found")
      return
    }

    // 获取已执行的迁移
    const executed = await getExecutedMigrations()
    logger.info(`Found ${executed.length} executed migrations`)

    // 执行新迁移
    let count = 0
    for (const file of sqlFiles) {
      if (executed.includes(file)) {
        logger.debug(`Skipping ${file} (already executed)`)
        continue
      }

      logger.info(`Executing migration: ${file}`)

      const filePath = path.join(migrationsDir, file)
      const sql = await fs.readFile(filePath, "utf-8")

      try {
        // 在事务中执行迁移
        await pool.query("BEGIN")
        await pool.query(sql)
        await recordMigration(file)
        await pool.query("COMMIT")

        logger.info(`✅ Successfully executed: ${file}`)
        count++
      } catch (error) {
        await pool.query("ROLLBACK")
        logger.error(`❌ Failed to execute: ${file}`, error as Error)
        throw error
      }
    }

    if (count === 0) {
      logger.info("All migrations are up to date")
    } else {
      logger.info(`✅ Successfully executed ${count} migration(s)`)
    }
  } catch (error) {
    logger.error("Migration failed", error as Error)
    throw error
  } finally {
    await pool.end()
  }
}

// 运行迁移
runMigrations()
  .then(() => {
    logger.info("Migration completed")
    process.exit(0)
  })
  .catch((error) => {
    logger.error("Migration error", error)
    process.exit(1)
  })
