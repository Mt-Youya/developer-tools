// test-routes.js
import { createApp } from "../src/app"

const app = createApp()

// 手动测试路由匹配
const testPaths = ["/api/v1/health", "/api/v1/games/test", "/api/v1/games/all", "/api/v1/games/epic"]

console.log("🧪 Testing route matching...")

testPaths.forEach((path) => {
  const mockCtx = {
    method: "GET",
    path: path,
    status: 404,
    body: null,
  }

  const mockNext = () => {}

  // 模拟中间件执行
  app.middleware.forEach((middleware) => {
    try {
      middleware(mockCtx, mockNext)
    } catch (e) {
      // 忽略错误
    }
  })

  console.log(`Path: ${path} -> Status: ${mockCtx.status}`)
})
