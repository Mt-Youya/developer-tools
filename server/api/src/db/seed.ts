import { logger } from "../utils/logger"
import { hashPassword } from "../utils/password"
import { pool, testConnection } from "./connection"

async function seed() {
  try {
    // 测试连接
    const connected = await testConnection()
    if (!connected) {
      throw new Error("Database connection failed")
    }

    logger.info("Starting database seeding...")

    // 清空现有数据（可选）
    // await pool.query('TRUNCATE users, sessions, posts CASCADE')

    // 创建管理员用户
    const adminPassword = await hashPassword("Admin123!")
    const adminResult = await pool.query(
      `INSERT INTO users (email, password_hash, name, role, is_active, email_verified)
       VALUES ($1, $2, $3, $4, $5, $6)
       ON CONFLICT (email) DO NOTHING
       RETURNING id`,
      ["admin@example.com", adminPassword, "Admin User", "admin", true, true]
    )

    if (adminResult.rowCount && adminResult.rowCount > 0) {
      logger.info("✅ Admin user created: admin@example.com / Admin123!")
    }

    // 创建测试用户
    const userPassword = await hashPassword("User123!")
    const users = [
      ["user1@example.com", userPassword, "John Doe", "user"],
      ["user2@example.com", userPassword, "Jane Smith", "user"],
      ["guest@example.com", userPassword, "Guest User", "guest"],
    ]

    for (const [email, password, name, role] of users) {
      const result = await pool.query(
        `INSERT INTO users (email, password_hash, name, role, is_active, email_verified)
         VALUES ($1, $2, $3, $4, $5, $6)
         ON CONFLICT (email) DO NOTHING
         RETURNING id`,
        [email, password, name, role, true, false]
      )

      if (result.rowCount && result.rowCount > 0) {
        logger.info(`✅ User created: ${email} / User123!`)
      }
    }

    // 创建示例文章
    const userIds = await pool.query("SELECT id FROM users WHERE role = $1", ["user"])

    if (userIds.rows.length > 0) {
      const userId = userIds.rows[0].id

      const posts = [
        {
          title: "Getting Started with TypeScript",
          content: "TypeScript is a typed superset of JavaScript...",
          slug: "getting-started-typescript",
          status: "published",
        },
        {
          title: "Building REST APIs with Koa",
          content: "Koa is a modern web framework for Node.js...",
          slug: "building-rest-apis-koa",
          status: "published",
        },
        {
          title: "Draft Post",
          content: "This is a draft post...",
          slug: "draft-post",
          status: "draft",
        },
      ]

      for (const post of posts) {
        await pool.query(
          `INSERT INTO posts (user_id, title, content, slug, status, published_at)
           VALUES ($1, $2, $3, $4, $5, $6)
           ON CONFLICT (slug) DO NOTHING`,
          [userId, post.title, post.content, post.slug, post.status, post.status === "published" ? new Date() : null]
        )
      }

      logger.info("✅ Sample posts created")
    }

    logger.info("🎉 Database seeding completed successfully!")

    logger.info("\n📝 Test credentials:")
    logger.info("Admin: admin@example.com / Admin123!")
    logger.info("User: user1@example.com / User123!")
  } catch (error) {
    logger.error("Seeding failed:", error as Error)
    throw error
  } finally {
    await pool.end()
  }
}

// 运行种子脚本
seed()
  .then(() => {
    process.exit(0)
  })
  .catch((error) => {
    logger.error("Seed error:", error)
    process.exit(1)
  })
