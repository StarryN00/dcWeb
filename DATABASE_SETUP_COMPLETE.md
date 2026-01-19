# 🎉 PostgreSQL 数据库设置完成!

我已经为你完成了 PostgreSQL 数据库的完整配置。

## 📦 已创建的文件

### 配置文件
- ✅ `docker-compose.yml` - Docker 容器配置
- ✅ `.env` - 已更新数据库连接信息
- ✅ `prisma/schema.prisma` - 已修复 Prisma 7.x 配置

### 脚本文件
- ✅ `scripts/setup-database.bat` - 一键设置数据库
- ✅ `scripts/start-db.bat` - 启动数据库
- ✅ `scripts/stop-db.bat` - 停止数据库
- ✅ `scripts/reset-db.bat` - 重置数据库

### 文档文件
- ✅ `README_DATABASE.md` - 快速入门指南
- ✅ `docs/DATABASE_SETUP.md` - 详细设置文档

---

## 🚀 下一步操作

### 方案 1: 使用 Docker (推荐)

#### 1. 安装 Docker Desktop
访问: https://www.docker.com/products/docker-desktop/
- 下载并安装 Docker Desktop for Windows
- 安装完成后**重启电脑**
- 启动 Docker Desktop (确保系统托盘中有 Docker 图标)

#### 2. 运行一键设置
在项目根目录双击运行:
```
scripts/setup-database.bat
```

或在命令行中逐步执行:
```bash
# 1. 启动数据库容器
npm run db:start

# 2. 等待 5-10 秒,然后初始化表结构
npm run db:push

# 3. 填充示例数据
npm run db:seed

# 4. 启动开发服务器
npm run dev
```

### 方案 2: 传统安装 (不用 Docker)

查看详细步骤: [docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)

---

## 🔍 验证设置

设置完成后,访问:
- **网站首页**: http://localhost:3000
- **数据库管理**: 运行 `npm run db:studio`,访问 http://localhost:5555

---

## 📊 数据库连接信息

```
主机: localhost
端口: 5432
数据库: dcweb_db
用户名: dcweb_user
密码: dcweb_password_2024
```

连接字符串已配置在 `.env` 文件中:
```
DATABASE_URL="postgresql://dcweb_user:dcweb_password_2024@localhost:5432/dcweb_db?schema=public"
```

---

## 💡 常用命令

```bash
# 数据库管理
npm run db:start     # 启动数据库
npm run db:stop      # 停止数据库
npm run db:push      # 同步数据库表结构
npm run db:seed      # 填充示例数据
npm run db:studio    # 打开数据库管理界面
npm run db:reset     # 重置数据库(删除所有数据)

# 开发
npm run dev          # 启动开发服务器 (http://localhost:3000)
npm run build        # 构建生产版本
npm run start        # 启动生产服务器
```

---

## 🐛 问题排查

### 问题 1: Hydration 警告 (浏览器控制台)
```
Error: A tree hydrated but some attributes didn't match...
data-ext-version="3.3.1"
```

**解决方案**: 这是浏览器扩展导致的,不影响功能。可以:
- 使用无痕模式测试
- 禁用浏览器扩展
- 忽略此警告

### 问题 2: 数据库连接失败 (ECONNREFUSED)
```
code: 'ECONNREFUSED'
```

**解决方案**:
1. 确认 Docker Desktop 正在运行
2. 运行 `npm run db:start` 启动数据库
3. 等待 5-10 秒让数据库完全启动
4. 检查容器状态: `docker-compose ps`
5. 查看日志: `docker-compose logs postgres`

### 问题 3: 端口 5432 已被占用

**解决方案 A**: 停止占用端口的进程
```bash
netstat -ano | findstr :5432
taskkill /PID <进程ID> /F
```

**解决方案 B**: 修改端口
1. 编辑 `docker-compose.yml`,将 `"5432:5432"` 改为 `"5433:5432"`
2. 编辑 `.env`,将端口 `5432` 改为 `5433`

---

## 📚 更多资源

- **快速入门**: [README_DATABASE.md](./README_DATABASE.md)
- **详细文档**: [docs/DATABASE_SETUP.md](./docs/DATABASE_SETUP.md)
- **项目说明**: [PROJECT_SUMMARY.md](./PROJECT_SUMMARY.md)
- **Prisma 文档**: https://www.prisma.io/docs
- **Docker 文档**: https://docs.docker.com/

---

## ✨ 功能特点

设置完成后,你的数据库将包含:
- ✅ 管理员账户系统
- ✅ 装修案例数据模型
- ✅ 潜客信息管理
- ✅ 自动潜客评分系统
- ✅ 完整的业务枚举类型
- ✅ 示例数据(如果运行了 seed)

---

需要帮助?查看文档或重新运行 `scripts/setup-database.bat`!
