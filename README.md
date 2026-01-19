# 🛠️ 开发工具配置指南

> 一份完整的开发环境配置文档，帮助你快速搭建项目所需的基础设施

## 📋 目录

- [代码质量检查](#-代码质量检查)
- [环境要求](#-环境要求)
- [数据库配置](#-数据库配置-postgresql-15)
- [缓存配置](#-redis-配置)
- [常用命令](#-常用命令速查)
- [故障排查](#-故障排查)

---

## ✨ 代码质量检查

### 🔧 日常开发
```bash
# 修复格式和 lint 问题
pnpm lint:fix

# 完整检查
pnpm check
```

### ✅ 提交前检查
```bash
# Biome 修复 + Oxlint 检查
pnpm check

# TypeScript 类型检查
pnpm typecheck
```

### 🚀 CI/CD 流程
```bash
pnpm lint      # Biome 检查
pnpm oxlint    # Oxlint 检查
pnpm typecheck # TypeScript 类型检查
```

---

## 💻 环境要求

| 工具 | 版本要求 | 说明 |
|:---:|:---:|:---|
| 🔄 **[fnm](https://github.com/Schniz/fnm?tab=readme-ov-file#using-homebrew-macoslinux)** | latest | Node 版本管理工具(NVM替代品) |
| 🟢 **Node.js** | >= 24 | JavaScript 运行时 |
| 📦 **pnpm** | >= 10.26 | 快速的包管理器 |
| **[oxc](https://marketplace.visualstudio.com/items?itemName=oxc.oxc-vscode)** | latest | eslint替代品
| **[biome](https://marketplace.visualstudio.com/items?itemName=biomejs.biome)** | latest | prettier替代品 

### 安装 fnm (有NVM可以跳过)
```bash
brew install fnm
```

---

## 🗄️ 数据库配置 (PostgreSQL 15)

### 🍎 macOS 安装
```bash
brew install postgresql@15
brew services start postgresql@15
psql postgres
```

### 🐧 Linux 云环境启动
```bash
# 启动 PostgreSQL 服务
pg_ctl -D /home/linuxbrew/.linuxbrew/var/postgresql@15 start

# 或使用完整路径
# /home/linuxbrew/.linuxbrew/opt/postgresql@15/bin/pg_ctl \
#  -D /home/linuxbrew/.linuxbrew/var/postgresql@15 start

# 添加到环境变量
echo 'export PATH="/home/linuxbrew/.linuxbrew/opt/postgresql@15/bin:$PATH"' >> ~/.bashrc
source ~/.bashrc
```

### 📊 数据库初始化

```sql
-- 👤 创建用户 (可自定义用户名和密码)
CREATE USER yonjay WITH PASSWORD 'postgres'; 
-- 💡 区别：CREATE USER 等同于 CREATE ROLE ... WITH LOGIN，USER 默认带登录权限

-- 🗑️ 删除已存在的数据库 (如有)
DROP DATABASE IF EXISTS devtools_server_db;

-- 🆕 创建新数据库
CREATE DATABASE devtools_server_db
    WITH
    OWNER = yonjay -- 注意改名字
    ENCODING = 'UTF8'
    LC_COLLATE = 'en_US.UTF-8'
    LC_CTYPE = 'en_US.UTF-8'
    TEMPLATE = template1;

-- 🔑 授予权限
GRANT ALL PRIVILEGES ON DATABASE devtools_server_db TO yonjay; -- 注意改名字

-- 📋 查看数据库列表
\l      -- 简略列表
\l+     -- 详细列表

-- 👋 退出
\q
```

> 以下是可选

| 参数 | 作用 | 是否必须 | 可选值/说明 |
|:---:| :--- | :--- | :---|
| `OWNER` | 指定数据库所有者 | 否 | 默认为创建者，可改为其他用户 |
| `ENCODING` | 字符编码 | 否 | UTF8、SQL_ASCII、LATIN1 等 |
| `LC_COLLATE` | 排序规则 | 否 | 影响字符串排序，如 zh_CN.UTF-8、C |
| `LC_CTYPE` | 字符分类 | 否 | 影响字符类型判断（大小写等）|
| `TEMPLATE` | 模板数据库 | 否 | template0（空模板）或 template1（默认）|

```sql
-- 授予部分权限（可选）
GRANT CONNECT, CREATE ON DATABASE devtools_server_db TO yonjay;

-- 撤销权限（可选）
REVOKE ALL PRIVILEGES ON DATABASE devtools_server_db FROM yonjay;

-- 授予超级用户权限（慎用）（可选）
ALTER USER yonjay WITH SUPERUSER;
```


> **改完之后注意在 [.env](server/api/.env) 文件也改一下名字** 

---

## 🔴 Redis 配置

### 🍎 macOS 安装
```bash
brew install redis
brew services start redis

# 检查 Redis 服务状态
brew services list | grep redis
```

### ▶️ 手动启动 Redis
```bash
redis-server
```

### 🐧 Linux 云环境启动
```bash
# 后台运行 Redis
/home/linuxbrew/.linuxbrew/opt/redis/bin/redis-server \
  /home/linuxbrew/.linuxbrew/etc/redis.conf --daemonize yes

# 检查 Redis 进程
ps aux | grep redis-server
```

📝 **配置文件位置**: `/home/linuxbrew/.linuxbrew/etc/redis.conf`

---

## Run
```bash
fnm use 24 # fnm 可以替换为 nvm
corepack use pnpm@latest
pnpm -v
pnpm i 
pnpm dev # 这两个分开执行
pnpm serve # 这两个分开执行
```

## ⚡ 常用命令速查

| 操作 | 命令 |
|:---:|:---|
| 📥 安装依赖 | `pnpm install` |
| 🚀 开发模式 | `pnpm dev` |
| 🏗️ 构建项目 | `pnpm build` |
| 🔍 代码检查 | `pnpm check` |
| 📝 类型检查 | `pnpm typecheck` |
| 🔧 修复问题 | `pnpm lint:fix` |

---

## 🔧 故障排查

### ⚠️ PostgreSQL 连接失败

1. **检查服务状态**
   ```bash
   brew services list | grep postgresql
   ```

2. **查看日志**
   ```bash
   tail -f /home/linuxbrew/.linuxbrew/var/postgresql@15/server.log
   ```

3. **重启服务**
   ```bash
   brew services restart postgresql@15
   ```

### ⚠️ Redis 连接失败

1. **检查进程**
   ```bash
   ps aux | grep redis
   ```

2. **测试连接**
   ```bash
   redis-cli ping  # 应返回 PONG
   ```

3. **重启服务**
   ```bash
   brew services restart redis
   ```

---

## 💡 注意事项

- ⚡ 首次运行前请确保所有服务已启动
- 🐧 Linux 环境需要使用 Homebrew for Linux 的完整路径
- 🔐 数据库用户名和密码可根据实际需求修改
- 💾 建议定期备份数据库数据

---

<div align="center">

**📚 更多文档** | **🐛 问题反馈** | **⭐ Star 支持**

Made with ❤️ by Development Team

</div>