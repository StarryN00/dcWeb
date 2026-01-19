# 数据库管理脚本

## 📦 包含的脚本

### 1. `install-postgres.sh`
**用途**: 一键安装 PostgreSQL 数据库

**使用方法**:
```bash
cd /mnt/d/AIProgram/dcWeb
./scripts/install-postgres.sh
```

**功能**:
- 更新 apt 包列表
- 安装 PostgreSQL 和相关工具
- 启动 PostgreSQL 服务
- 显示下一步操作指南

---

### 2. `init-database.sql`
**用途**: 初始化数据库和用户的 SQL 脚本

**手动使用方法**:
```bash
sudo -u postgres psql -f scripts/init-database.sql
```

**功能**:
- 创建数据库 `dcweb_db`
- 创建用户 `dcweb_admin` (密码: `dcweb_password_2026`)
- 授予所有必要权限

---

### 3. `db-manager.sh` (推荐)
**用途**: 全功能数据库管理工具

**使用方法**:
```bash
./scripts/db-manager.sh [命令]
```

**可用命令**:

| 命令 | 说明 | 示例 |
|------|------|------|
| `status` | 检查 PostgreSQL 状态 | `./scripts/db-manager.sh status` |
| `start` | 启动 PostgreSQL 服务 | `./scripts/db-manager.sh start` |
| `stop` | 停止 PostgreSQL 服务 | `./scripts/db-manager.sh stop` |
| `restart` | 重启 PostgreSQL 服务 | `./scripts/db-manager.sh restart` |
| `init` | 初始化数据库(创建数据库和用户) | `./scripts/db-manager.sh init` |
| `migrate` | 运行 Prisma 迁移 | `./scripts/db-manager.sh migrate` |
| `studio` | 打开 Prisma Studio | `./scripts/db-manager.sh studio` |
| `help` | 显示帮助信息 | `./scripts/db-manager.sh help` |

---

## 🚀 快速开始指南

### 完整安装流程 (从零开始)

**步骤 1: 安装 PostgreSQL**
```bash
cd /mnt/d/AIProgram/dcWeb
./scripts/install-postgres.sh
```

**步骤 2: 初始化数据库**
```bash
./scripts/db-manager.sh init
```

**步骤 3: 更新 .env 文件**

编辑 `.env` 文件,更新 `DATABASE_URL`:
```env
DATABASE_URL="postgresql://dcweb_admin:dcweb_password_2026@localhost:5432/dcweb_db?schema=public"
```

**步骤 4: 运行 Prisma 迁移**
```bash
./scripts/db-manager.sh migrate
```

**步骤 5: 验证安装**
```bash
./scripts/db-manager.sh studio
```

浏览器会自动打开 Prisma Studio (http://localhost:5555)

---

## 📋 常用操作

### 每次启动 WSL2 后
```bash
# 启动 PostgreSQL 服务
./scripts/db-manager.sh start

# 或者检查状态
./scripts/db-manager.sh status
```

### 查看数据库内容
```bash
./scripts/db-manager.sh studio
```

### 更新数据库 schema
```bash
# 修改 prisma/schema.prisma 后
./scripts/db-manager.sh migrate
```

### 重置数据库
```bash
# 删除所有数据并重新创建表
npx prisma db push --force-reset
```

---

## 🔧 故障排除

### 问题 1: PostgreSQL 服务无法启动

**原因**: 可能是之前的进程未正确关闭

**解决方法**:
```bash
# 检查是否有 PostgreSQL 进程
ps aux | grep postgres

# 停止所有 PostgreSQL 进程
sudo killall -9 postgres

# 重新启动
./scripts/db-manager.sh start
```

### 问题 2: 端口 5432 被占用

**检查占用端口的进程**:
```bash
sudo lsof -i :5432
```

**解决方法**:
```bash
# 停止占用端口的进程
sudo kill -9 <PID>

# 或者修改 PostgreSQL 端口
sudo nano /etc/postgresql/*/main/postgresql.conf
# 修改: port = 5433
```

### 问题 3: Prisma 连接错误

**错误信息**: `Can't reach database server at localhost:5432`

**解决方法**:
```bash
# 1. 检查 PostgreSQL 是否运行
./scripts/db-manager.sh status

# 2. 检查 .env 文件中的 DATABASE_URL 是否正确
cat .env | grep DATABASE_URL

# 3. 测试数据库连接
npx prisma db pull
```

### 问题 4: 权限不足

**错误信息**: `permission denied for schema public`

**解决方法**:
```bash
# 重新运行初始化脚本
./scripts/db-manager.sh init
```

---

## 🔐 安全建议

### 生产环境
- ✅ 修改默认密码 `dcweb_password_2026`
- ✅ 使用环境变量存储密码
- ✅ 启用 SSL 连接
- ✅ 限制数据库访问 IP

### 修改密码
```sql
-- 连接到 PostgreSQL
sudo -u postgres psql

-- 修改密码
ALTER USER dcweb_admin WITH PASSWORD 'new_secure_password';

-- 退出
\q
```

然后更新 `.env` 文件中的 `DATABASE_URL`

---

## 📊 数据库信息

**数据库名称**: `dcweb_db`

**用户名**: `dcweb_admin`

**默认密码**: `dcweb_password_2026`

**端口**: `5432`

**数据表**:
- `User` - 管理员用户
- `Case` - 装修案例
- `Lead` - 潜客信息

---

## 📝 .env 配置示例

```env
# 数据库连接
DATABASE_URL="postgresql://dcweb_admin:dcweb_password_2026@localhost:5432/dcweb_db?schema=public"

# NextAuth (未来添加)
NEXTAUTH_URL=http://localhost:3600
NEXTAUTH_SECRET=your-secret-key-here

# 开发模式
NODE_ENV=development
```

---

## 🔗 相关文档

- [PostgreSQL 完整安装指南](../docs/POSTGRESQL_SETUP.md)
- [Prisma 文档](https://www.prisma.io/docs/)
- [Next.js 数据库集成](https://nextjs.org/docs/app/building-your-application/data-fetching)

---

**创建时间**: 2026-01-17
**适用系统**: Ubuntu 24.04 LTS on WSL2
