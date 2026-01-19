@echo off
REM 停止 PostgreSQL Docker 容器

echo 正在停止 PostgreSQL 数据库...
docker-compose down

echo.
echo 数据库已停止!
echo.
pause
