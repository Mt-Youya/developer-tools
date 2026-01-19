#!/bin/bash

echo "🚀 Starting development environment..."

# 启动数据库和 Redis
docker-compose -f docker/docker-compose.yml up -d

# 等待服务启动
sleep 5

# 运行数据库迁移
cd server/api && pnpm db:migrate

# 测试 Redis 连接
echo "🧪 Testing Redis connection..."
node __test__/redis_setup.ts

# 启动所有服务
pnpm dev
