#!/usr/bin/env bash

# -------------------------------
# 🚀 pnpm monorepo 一键升级脚本
# 适用于所有子包
# -------------------------------

set -e  # 遇到错误立即退出
echo "📦 开始升级 pnpm monorepo 依赖..."

# 检查 pnpm 是否安装
if ! command -v pnpm &> /dev/null; then
  echo "❌ 未检测到 pnpm，请先安装：npm i -g pnpm"
  exit 1
fi

# 进入项目根目录
ROOT_DIR=$(dirname "$0")/..
cd "$ROOT_DIR" || exit 1

echo "🔍 检查过期依赖..."
pnpm outdated -r || true

echo "⬆️ 升级所有依赖到最新版本..."
pnpm up -rL

echo "🧹 清理旧依赖..."
rm -rf node_modules pnpm-lock.yaml

echo "📥 重新安装依赖..."
pnpm install

echo "🧩 去重依赖版本..."
pnpm dedupe

# 检查是否安装 syncpack
if pnpm list syncpack >/dev/null 2>&1; then
  echo "🔧 统一依赖版本..."
  pnpm exec syncpack fix-mismatches
else
  echo "⚠️ 未检测到 syncpack，建议安装：pnpm add -Dw syncpack"
fi

echo "✅ 所有依赖已升级完成！"
