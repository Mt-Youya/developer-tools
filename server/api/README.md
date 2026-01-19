# API Server

基于 Koa + PostgreSQL + TypeScript 的后端 API 服务

## 🚀 快速开始

### 1. 环境要求

- Node.js >= 22.0.0
- PostgreSQL >= 14
- pnpm >= 10.0.0

### 2. 安装依赖

```bash
pnpm install
```

### 3. 配置环境变量

重要配置项：
- `DB_*`: 数据库连接信息
- `JWT_SECRET`: JWT 密钥（生产环境必须修改）
- `CORS_ORIGIN`: 允许的跨域来源

### 4. 初始化数据库

```bash
# 运行迁移
pnpm db:migrate

# 填充种子数据（可选）
pnpm db:seed
```

### 5. 启动服务

```bash
# 开发模式
pnpm dev

# 生产模式
pnpm build
pnpm start
```

服务将在 `http://localhost:4000` 启动

## 📁 项目结构

```
src/
├── config/          # 配置管理
├── db/              # 数据库连接和迁移
├── models/          # 数据模型
├── repositories/    # 数据访问层
├── services/        # 业务逻辑层
├── controllers/     # 控制器
├── routes/          # 路由定义
├── middlewares/     # 中间件
├── utils/           # 工具函数
└── types/           # TypeScript 类型
```

## 🔑 API 端点

### 认证 (`/api/v1/auth`)

| 方法 | 路径 | 描述 | 认证 |
|------|------|------|------|
| POST | `/register` | 用户注册 | ❌ |
| POST | `/login` | 用户登录 | ❌ |
| POST | `/refresh` | 刷新令牌 | ❌ |
| POST | `/logout` | 登出 | ❌ |
| GET | `/me` | 获取当前用户 | ✅ |
| POST | `/logout-all` | 登出所有设备 | ✅ |
| GET | `/sessions` | 获取用户会话 | ✅ |

### 用户 (`/api/v1/users`)

| 方法 | 路径 | 描述 | 认证 | 权限 |
|------|------|------|------|------|
| GET | `/` | 获取用户列表 | ✅ | Admin |
| GET | `/:id` | 获取用户详情 | ✅ | - |
| POST | `/` | 创建用户 | ✅ | Admin |
| PATCH | `/:id` | 更新用户 | ✅ | Owner/Admin |
| DELETE | `/:id` | 删除用户 | ✅ | Admin |
| POST | `/:id/change-password` | 修改密码 | ✅ | Owner/Admin |
| GET | `/search` | 搜索用户 | ✅ | - |
| GET | `/stats` | 用户统计 | ✅ | Admin |

## 🧪 测试账号

运行 `pnpm db:seed` 后可用：

- **管理员**: `admin@example.com` / `Admin123!`
- **普通用户**: `user1@example.com` / `User123!`

## 📝 使用示例

### 注册

```bash
curl -X POST http://localhost:4000/api/v1/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Test123!",
    "name": "Test User"
  }'
```

### 登录

```bash
curl -X POST http://localhost:4000/api/v1/auth/login \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "Admin123!"
  }'
```

响应：
```json
{
  "success": true,
  "data": {
    "user": { ... },
    "tokens": {
      "accessToken": "eyJhbGc...",
      "refreshToken": "eyJhbGc..."
    }
  }
}
```

### 使用 Token 访问受保护的接口

```bash
curl -X GET http://localhost:4000/api/v1/users \
  -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
```

## 🛠️ 开发命令

```bash
# 开发
pnpm dev              # 启动开发服务器

# 构建
pnpm build            # 编译 TypeScript
pnpm start            # 运行生产版本

# 数据库
pnpm db:migrate       # 运行迁移
pnpm db:seed          # 填充种子数据
pnpm db:reset         # 重置数据库（迁移+种子）

# 代码质量
pnpm lint             # 代码检查
pnpm lint:fix         # 自动修复
pnpm type-check       # 类型检查

# 测试
pnpm test             # 运行测试
pnpm test:coverage    # 测试覆盖率
```

## 🏗️ 架构设计

### 分层架构

```
Controller → Service → Repository → Database
    ↓
Middleware (认证、验证、日志等)
```

- **Controller**: 处理 HTTP 请求和响应
- **Service**: 实现业务逻辑
- **Repository**: 数据访问抽象层
- **Middleware**: 横切关注点

### 数据流

1. 请求进入 → 中间件处理（日志、认证等）
2. 路由匹配 → 验证中间件（Zod Schema）
3. Controller 接收 → 调用 Service
4. Service 处理业务逻辑 → 调用 Repository
5. Repository 执行数据库操作
6. 响应返回 → 错误处理中间件

## 🔐 安全特性

- ✅ JWT 认证 (Access + Refresh Token)
- ✅ 密码加密 (bcrypt)
- ✅ 请求验证 (Zod)
- ✅ CORS 配置
- ✅ Helmet 安全头
- ✅ 速率限制
- ✅ SQL 注入防护（参数化查询）
- ✅ 输入验证和清理

## 📊 日志

日志存储在 `logs/` 目录：
- `error-YYYY-MM-DD.log`: 错误日志
- `combined-YYYY-MM-DD.log`: 所有日志

## 🐛 调试

设置环境变量启用调试日志：

```bash
LOG_LEVEL=debug pnpm dev
```

## 📦 添加新功能

### 1. 创建迁移文件

`src/db/migrations/002_create_posts.sql`

### 2. 创建 Repository

`src/repositories/PostRepository.ts`

### 3. 创建 Service

`src/services/post.service.ts`

### 4. 创建 Controller

`src/controllers/post.controller.ts`

### 5. 创建路由

`src/routes/post.routes.ts`

### 6. 注册路由

在 `src/app.ts` 中注册新路由

## 🤝 贡献指南

1. Fork 项目
2. 创建功能分支
3. 提交更改
4. 推送到分支
5. 创建 Pull Request

## 📄 许可证

MIT
