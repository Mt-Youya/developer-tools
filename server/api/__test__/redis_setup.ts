import { redis } from "../src/redis/connection"

async function testRedis() {
  try {
    console.log("🧪 Testing Redis connection...")

    // 测试基本连接
    await redis.set("test:key", "Hello Redis!", 10)
    const value = await redis.get("test:key")
    console.log("✅ Basic set/get:", value)

    // 测试 JSON 序列化
    const testData = { name: "Test", number: 42, active: true }
    await redis.set("test:object", testData, 10)
    const retrieved = await redis.get("test:object")
    console.log("✅ JSON serialization:", retrieved)

    // 测试哈希
    await redis.hset("test:hash", "field1", "value1")
    await redis.hset("test:hash", "field2", { nested: "object" })
    const hashValue = await redis.hget("test:hash", "field2")
    console.log("✅ Hash operations:", hashValue)

    // 测试列表
    await redis.lpush("test:list", "item1")
    await redis.lpush("test:list", "item2")
    const listItem = await redis.rpop("test:list")
    console.log("✅ List operations:", listItem)

    // 清理测试数据
    await redis.del("test:key")
    await redis.del("test:object")
    await redis.del("test:hash")
    await redis.del("test:list")

    console.log("🎉 All Redis tests passed!")
  } catch (error) {
    console.error("❌ Redis test failed:", error)
  } finally {
    await redis.disconnect()
  }
}

testRedis()
