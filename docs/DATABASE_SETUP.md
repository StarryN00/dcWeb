# PostgreSQL 数据库设置指南

## 方案 1: 使用 Docker (推荐)

### 前置要求
- 安装 Docker Desktop for Windows: https://www.docker.com/products/docker-desktop/

### 启动步骤

1. **启动 PostgreSQL 容器**
   ```bash
   docker-compose up -d
   ```

2. **检查容器状态**
   ```bash
   docker-compose ps
   ```

3. **初始化数据库表结构**
   ```bash
   npm run db:push
   ```

4. **填充示例数据 (可选)**
   ```bash
   npm run db:seed
   ```

5. **启动开发服务器**
   ```bash
   npm run dev
   ```

### 常用命令

```bash
# 启动数据库
docker-compose up -d

# 停止数据库
docker-compose down

# 停止并删除数据 (谨慎使用!)
docker-compose down -v

# 查看数据库日志
docker-compose logs postgres

# 打开数据库管理界面
npm run db:studio
```

### 连接信息

- **主机**: localhost
- **端口**: 5432
- **数据库名**: dcweb_db
- **用户名**: dcweb_user
- **密码**: dcweb_password_2024
- **连接字符串**: 已在 `.env` 文件中配置

---

## 方案 2: 直接安装 PostgreSQL (传统方式)

### 下载安装

1. 访问 PostgreSQL 官网: https://www.postgresql.org/download/windows/
2. 下载最新版本的 Windows 安装程序
3. 运行安装程序,按默认设置安装
4. **记住你设置的 postgres 超级用户密码**

### 配置数据库

安装完成后,打开 **SQL Shell (psql)** 或 **pgAdmin**,执行以下命令:

```sql
-- 创建数据库用户
CREATE USER dcweb_user WITH PASSWORD 'dcweb_password_2024';

-- 创建数据库
CREATE DATABASE dcweb_db OWNER dcweb_user;

-- 授予权限
GRANT ALL PRIVILEGES ON DATABASE dcweb_db TO dcweb_user;
```

### 初始化项目数据库

```bash
# 初始化数据库表结构
npm run db:push

# 填充示例数据
npm run db:seed

# 启动开发服务器
npm run dev
```

---

## 验证数据库连接

运行以下命令测试连接:

```bash
# 使用 Prisma Studio 打开数据库管理界面
npm run db:studio
```

如果能成功打开 Prisma Studio (http://localhost:5555),说明数据库连接成功!

---

## 故障排除

### 问题 1: 端口 5432 已被占用

```bash
# Windows 查看占用端口的进程
netstat -ano | findstr :5432

# 停止占用端口的进程 (将 <PID> 替换为实际进程 ID)
taskkill /PID <PID> /F
```

### 问题 2: Docker 容器启动失败

```bash
# 查看详细错误日志
docker-compose logs

# 重新创建容器
docker-compose down
docker-compose up -d
```

### 问题 3: 连接被拒绝 (ECONNREFUSED)

- 确认 PostgreSQL 服务正在运行
- 检查 `.env` 文件中的连接信息是否正确
- 确认防火墙没有阻止 5432 端口

---

## 数据库管理工具推荐

1. **Prisma Studio** (内置)
   ```bash
   npm run db:studio
   ```

2. **pgAdmin 4** (PostgreSQL 官方工具)
   - 随 PostgreSQL 安装自动安装

3. **DBeaver** (通用数据库工具)
   - https://dbeaver.io/

4. **TablePlus** (现代化 GUI 工具)
   - https://tableplus.com/
