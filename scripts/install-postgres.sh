#!/bin/bash

echo "=========================================="
echo "PostgreSQL 安装脚本 for WSL2 Ubuntu"
echo "=========================================="
echo ""

# 更新包列表
echo "📦 1. 更新包列表..."
sudo apt update

# 安装 PostgreSQL
echo "📥 2. 安装 PostgreSQL..."
sudo apt install postgresql postgresql-contrib -y

# 启动服务
echo "🚀 3. 启动 PostgreSQL 服务..."
sudo service postgresql start

# 检查状态
echo "✅ 4. 检查服务状态..."
sudo service postgresql status

echo ""
echo "=========================================="
echo "✅ PostgreSQL 安装完成!"
echo "=========================================="
echo ""
echo "📝 下一步操作:"
echo ""
echo "1️⃣  执行以下命令创建数据库和用户:"
echo "   sudo -u postgres psql"
echo ""
echo "2️⃣  在 PostgreSQL 命令行中执行:"
echo "   CREATE DATABASE dcweb_db;"
echo "   CREATE USER dcweb_admin WITH PASSWORD 'dcweb_password_2026';"
echo "   GRANT ALL PRIVILEGES ON DATABASE dcweb_db TO dcweb_admin;"
echo "   \\c dcweb_db"
echo "   GRANT ALL ON SCHEMA public TO dcweb_admin;"
echo "   GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dcweb_admin;"
echo "   GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dcweb_admin;"
echo "   \\q"
echo ""
echo "3️⃣  更新 .env 文件:"
echo "   DATABASE_URL=\"postgresql://dcweb_admin:dcweb_password_2026@localhost:5432/dcweb_db?schema=public\""
echo ""
echo "4️⃣  运行 Prisma 迁移:"
echo "   cd /mnt/d/AIProgram/dcWeb"
echo "   npx prisma db push"
echo ""
echo "=========================================="
