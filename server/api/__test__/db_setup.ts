import pkg from "pg"
import { config } from "../src/config"

const { Client } = pkg

const client = new Client({
  host: config.db.host,
  port: config.db.port,
  database: config.db.database,
  user: config.db.user,
})

async function testSetup() {
  try {
    // 测试连接
    await client.connect()
    console.log("✅ PostgreSQL 连接成功")

    // 测试版本查询
    const versionRes = await client.query("SELECT version()")
    console.log("📋 PostgreSQL 版本:", versionRes.rows[0].version.split(",")[0])

    // 测试表是否存在
    const tablesRes = await client.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `)

    console.log("📊 数据库中的表:")
    tablesRes.rows.forEach((row) => {
      console.log("   -", row.table_name)
    })

    await client.end()
    console.log("🎉 所有测试通过！PostgreSQL 设置完成。")
  } catch (err) {
    console.error("❌ 设置测试失败:", err.message)
  }
}

testSetup()
