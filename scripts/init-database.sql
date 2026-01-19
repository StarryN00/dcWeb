-- PostgreSQL 数据库初始化脚本
-- 用途: 创建 dcweb 项目所需的数据库和用户

-- 1. 创建数据库
CREATE DATABASE dcweb_db;

-- 2. 创建用户
CREATE USER dcweb_admin WITH PASSWORD 'dcweb_password_2026';

-- 3. 授予数据库所有权限
GRANT ALL PRIVILEGES ON DATABASE dcweb_db TO dcweb_admin;

-- 4. 连接到新创建的数据库
\c dcweb_db

-- 5. 授予 schema 权限 (PostgreSQL 15+ 需要)
GRANT ALL ON SCHEMA public TO dcweb_admin;

-- 6. 授予所有表的权限 (如果表已存在)
GRANT ALL PRIVILEGES ON ALL TABLES IN SCHEMA public TO dcweb_admin;

-- 7. 授予所有序列的权限
GRANT ALL PRIVILEGES ON ALL SEQUENCES IN SCHEMA public TO dcweb_admin;

-- 8. 设置默认权限 (对未来创建的表)
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON TABLES TO dcweb_admin;
ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT ALL ON SEQUENCES TO dcweb_admin;

-- 完成提示
\echo '✅ 数据库初始化完成!'
\echo '📊 数据库名称: dcweb_db'
\echo '👤 用户名称: dcweb_admin'
\echo '🔒 密码: dcweb_password_2026'
\echo ''
\echo '📝 下一步: 更新 .env 文件中的 DATABASE_URL'
\echo 'DATABASE_URL="postgresql://dcweb_admin:dcweb_password_2026@localhost:5432/dcweb_db?schema=public"'
