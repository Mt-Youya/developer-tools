#!/bin/sh

echo "Installing Git hooks..."

# 获取项目根目录
ROOT_DIR=$(git rev-parse --show-toplevel)

# 创建符号链接
ln -sf "$ROOT_DIR/scripts/git-hooks/pre-commit.sh" "$ROOT_DIR/.git/hooks/pre-commit"

# 确保有执行权限
chmod +x "$ROOT_DIR/.git/hooks/pre-commit"
chmod +x "$ROOT_DIR/scripts/git-hooks/pre-commit.sh"

echo "✅ Git hooks installed successfully!"