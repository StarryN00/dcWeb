@echo off
REM 启动 PostgreSQL Docker 容器

echo 正在启动 PostgreSQL 数据库...
docker-compose up -d

echo.
echo 等待数据库启动...
timeout /t 5 /nobreak >nul

echo.
echo 检查容器状态:
docker-compose ps

echo.
echo 数据库已启动!
echo 连接信息:
echo   主机: localhost
echo   端口: 5432
echo   数据库: dcweb_db
echo   用户名: dcweb_user
echo.
echo 下一步操作:
echo   1. 运行 'npm run db:push' 初始化数据库表
echo   2. 运行 'npm run db:seed' 填充示例数据 (可选)
echo   3. 运行 'npm run dev' 启动开发服务器
echo.
pause
