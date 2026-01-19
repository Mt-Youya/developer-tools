#!/bin/bash

set -e  # 遇到错误立即退出

echo "🚀 Starting development environment..."

PORT=5173
TIMEOUT=60

echo "🔍 检查端口 $PORT 是否被占用..."

# 检查端口是否被占用
if lsof -i :$PORT > /dev/null 2>&1; then
    echo "❌ 端口 $PORT 已被占用"
    exit 1
else
    echo "✅ 端口 $PORT 正在启动服务..."
fi

# 前台运行,保留所有输出
pnpm -F dev-tools dev &
DEV_PID=$!

# 等待端口可用
echo "⏳ 等待服务启动 (端口 $PORT)..."
START_TIME=$(date +%s)

while true; 
do
    if nc -z localhost $PORT 2>/dev/null; then
        echo "✅ 服务已就绪: http://localhost:$PORT"
        break
    fi
    
    CURRENT_TIME=$(date +%s)
    ELAPSED=$((CURRENT_TIME - START_TIME))
    
    if [ $ELAPSED -gt $TIMEOUT ]; then
        echo "❌ 启动超时"
        kill $DEV_PID 2>/dev/null
        exit 1
    fi
    
    sleep 1
done

echo "🚀 Development environment started."

# 等待进程结束
wait $DEV_PID

echo "🚀 Development environment exited."
