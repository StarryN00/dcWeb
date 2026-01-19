# 快速开始 - PostgreSQL 数据库设置

## 🚀 推荐方式:使用 Docker (5 分钟搞定)

### 1️⃣ 安装 Docker Desktop

如果还没有安装 Docker:
- 下载地址: https://www.docker.com/products/docker-desktop/
- 安装完成后重启电脑
- 启动 Docker Desktop

### 2️⃣ 运行一键设置脚本

在项目根目录双击运行:
```
scripts/setup-database.bat
```

或者在命令行中执行:
```bash
npm run db:start    # 启动数据库
npm run db:push     # 初始化表结构
npm run db:seed     # 填充示例数据
npm run dev         # 启动开发服务器
```

### ✅ 完成!

访问 http://localhost:3000 查看网站
访问 http://localhost:5555 查看数据库 (运行 `npm run db:studio`)

---

## 📋 常用命令

```bash
# 数据库管理
npm run db:start     # 启动数据库
npm run db:stop      # 停止数据库
npm run db:reset     # 重置数据库 (删除所有数据)
npm run db:studio    # 打开数据库管理界面

# 开发
npm run dev          # 启动开发服务器
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
```

---

## 🔧 如果你不想用 Docker

查看详细的传统安装方式: [docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)

---

## ❓ 遇到问题?

### 问题 1: 端口 5432 已被占用
```bash
# 查看占用进程
netstat -ano | findstr :5432

# 修改 docker-compose.yml 中的端口映射
ports:
  - "5433:5432"  # 改用 5433 端口

# 同时修改 .env 文件
DATABASE_URL="postgresql://dcweb_user:dcweb_password_2024@localhost:5433/dcweb_db?schema=public"
```

### 问题 2: Docker 没有启动
确保 Docker Desktop 正在运行 (系统托盘中有 Docker 图标)

### 问题 3: 数据库连接失败
```bash
# 查看数据库日志
docker-compose logs postgres

# 重启数据库
npm run db:stop
npm run db:start
```

---

## 📊 数据库连接信息

- **主机**: localhost
- **端口**: 5432
- **数据库名**: dcweb_db
- **用户名**: dcweb_user
- **密码**: dcweb_password_2024
- **连接字符串**: 已在 `.env` 文件中配置

---

需要更多帮助?查看 [docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md) 获取详细文档。
