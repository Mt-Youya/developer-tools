#!/bin/sh

ROOT_DIR=$(git rev-parse --show-toplevel)
STAGED_FILES=$(git diff --cached --name-only --diff-filter=ACMR)

# 如果使用 fnm
if command -v fnm >/dev/null 2>&1; then
    eval "$(fnm env --use-on-cd)"
    
    if [ -f "$ROOT_DIR/.node-version" ]; then
        fnm use
    fi
fi

# 检查 Node.js 版本
NODE_VERSION=$(node -v 2>/dev/null)
if [ $? -ne 0 ]; then
    echo "❌ Node.js not found in PATH"
    exit 1
fi

echo "ℹ️  Using Node.js $NODE_VERSION"

echo "🚀 Pre-commit checks starting..."

# 使用你定义的 check 命令
cd "$(git rev-parse --show-toplevel)"

echo "📝 Running code checks..."
pnpm check

if [ $? -ne 0 ]; then
    echo "❌ Code check failed"
    exit 1
fi

echo "🔧 Running type check..."
pnpm typecheck

if [ $? -ne 0 ]; then
    echo "❌ Type check failed"
    exit 1
fi

echo "✅ All checks passed!"
exit 0