# PostgreSQL 数据库配置指南

## 当前状态
- ❌ PostgreSQL 未安装
- ✅ .env 文件已存在
- ✅ Prisma schema 已定义

---

## 方案一: WSL2 Ubuntu 本地安装 (推荐)

### 步骤 1: 安装 PostgreSQL

打开 WSL2 终端,执行以下命令:

```bash
# 更新包列表
sudo apt update

# 安装 PostgreSQL
sudo apt install postgresql postgresql-contrib -y
```

### 步骤 2: 启动 PostgreSQL 服务

```bash
# 启动服务
sudo service postgresql start

# 检查服务状态
sudo service postgresql status
# 应该看到 "online" 或 "active"
```

### 步骤 3: 创建数据库和用户

```bash
# 切换到 postgres 用户
sudo -u postgres psql
```

在 PostgreSQL 命令行中执行:

```sql
-- 创建数据库
CREATE DATABASE dcweb_db;

-- 创建用户
CREATE USER dcweb_admin WITH PASSWORD 'dcweb_password_2026';

-- 授予所有权限
GRANT ALL PRIVILEGES ON DATABASE dcweb_db TO dcweb_admin;

-- 在 PostgreSQL 15+ 中,还需要授予 schema 权限
\c dcweb_db
GRANT ALL ON SCHEMA public TO dcweb_admin;
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dcweb_admin;
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dcweb_admin;

-- 退出
\q
```

### 步骤 4: 更新 .env 文件

更新 `/mnt/d/AIProgram/dcWeb/.env` 文件中的 `DATABASE_URL`:

```env
DATABASE_URL="postgresql://dcweb_admin:dcweb_password_2026@localhost:5432/dcweb_db?schema=public"
```

### 步骤 5: 运行 Prisma 迁移

```bash
cd /mnt/d/AIProgram/dcWeb
npx prisma db push
```

### 步骤 6: 验证数据库

```bash
# 打开 Prisma Studio
npx prisma studio

# 或者测试数据库连接
npx prisma db pull
```

---

## 方案二: 使用 Docker (如果已安装 Docker)

### 步骤 1: 安装 Docker Desktop for Windows

从 [Docker 官网](https://www.docker.com/products/docker-desktop) 下载并安装 Docker Desktop。

### 步骤 2: 启动 PostgreSQL 容器

```bash
docker run --name dcweb-postgres \
  -e POSTGRES_USER=dcweb_admin \
  -e POSTGRES_PASSWORD=dcweb_password_2026 \
  -e POSTGRES_DB=dcweb_db \
  -p 5432:5432 \
  -d postgres:16
```

### 步骤 3: 验证容器运行

```bash
docker ps
```

### 步骤 4: 更新 .env 文件

```env
DATABASE_URL="postgresql://dcweb_admin:dcweb_password_2026@localhost:5432/dcweb_db?schema=public"
```

### 步骤 5: 运行 Prisma 迁移

```bash
cd /mnt/d/AIProgram/dcWeb
npx prisma db push
```

---

## 方案三: 使用云数据库 (适合生产环境)

### 推荐服务:
1. **Supabase** (免费层,自带 PostgreSQL)
   - 网址: https://supabase.com
   - 免费: 500MB 数据库

2. **Neon** (免费层,Serverless PostgreSQL)
   - 网址: https://neon.tech
   - 免费: 0.5GB 存储

3. **Railway** (免费层)
   - 网址: https://railway.app
   - 免费: 512MB RAM

### 配置步骤 (以 Supabase 为例):

1. 注册 Supabase 账号
2. 创建新项目
3. 从项目设置中获取 Database URL
4. 更新 .env 文件:
   ```env
   DATABASE_URL="postgresql://postgres:[YOUR-PASSWORD]@db.[YOUR-PROJECT-REF].supabase.co:5432/postgres"
   ```

---

## WSL2 自动启动 PostgreSQL (可选)

如果选择方案一,可以让 PostgreSQL 随 WSL2 自动启动:

### 方法 1: 使用 wsl.conf

编辑 `/etc/wsl.conf`:
```bash
sudo nano /etc/wsl.conf
```

添加以下内容:
```ini
[boot]
command="service postgresql start"
```

### 方法 2: 添加到 .bashrc

编辑 `~/.bashrc`:
```bash
nano ~/.bashrc
```

在文件末尾添加:
```bash
# 自动启动 PostgreSQL
if ! service postgresql status > /dev/null 2>&1; then
    sudo service postgresql start > /dev/null 2>&1
fi
```

---

## 故障排除

### 问题 1: 端口 5432 已被占用

```bash
# 查看占用端口的进程
sudo lsof -i :5432

# 或者使用 netstat
sudo netstat -tulpn | grep 5432
```

### 问题 2: 无法连接到数据库

```bash
# 检查 PostgreSQL 是否在监听
sudo netstat -an | grep 5432

# 检查 pg_hba.conf 配置
sudo nano /etc/postgresql/*/main/pg_hba.conf
# 确保有这一行:
# local   all             all                                     trust
```

### 问题 3: Prisma 连接错误

```bash
# 测试数据库连接
npx prisma db pull

# 查看详细日志
npx prisma db push --preview-feature
```

---

## 推荐的下一步

### 方案选择建议:

**开发环境** (现在):
- ✅ **推荐方案一** (WSL2 本地安装): 简单、稳定、免费
- 如果有 Docker: 方案二也很好

**生产环境** (部署时):
- ✅ **推荐方案三** (云数据库): Vercel + Supabase 组合非常流行

---

## 快速执行脚本

为了方便你,我创建了一个安装脚本:

```bash
#!/bin/bash

echo "=========================================="
echo "PostgreSQL 安装脚本 for WSL2 Ubuntu"
echo "=========================================="

# 更新包列表
echo "1. 更新包列表..."
sudo apt update

# 安装 PostgreSQL
echo "2. 安装 PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y

# 启动服务
echo "3. 启动 PostgreSQL 服务..."
sudo service postgresql start

# 检查状态
echo "4. 检查服务状态..."
sudo service postgresql status

echo "=========================================="
echo "安装完成!"
echo "=========================================="
echo ""
echo "下一步: 执行以下命令创建数据库"
echo ""
echo "sudo -u postgres psql"
echo ""
echo "然后在 PostgreSQL 命令行中执行:"
echo "CREATE DATABASE dcweb_db;"
echo "CREATE USER dcweb_admin WITH PASSWORD 'dcweb_password_2026';"
echo "GRANT ALL PRIVILEGES ON DATABASE dcweb_db TO dcweb_admin;"
echo "\\c dcweb_db"
echo "GRANT ALL ON SCHEMA public TO dcweb_admin;"
echo "\\q"
```

保存为 `install-postgres.sh`,然后执行:
```bash
chmod +x install-postgres.sh
./install-postgres.sh
```

---

**配置完成后,回到项目目录运行**:
```bash
cd /mnt/d/AIProgram/dcWeb
npx prisma db push
npx prisma studio
```

---

**文档创建时间**: 2026-01-17
**适用系统**: Ubuntu 24.04 LTS on WSL2
