@echo off
REM 完整的数据库设置流程

echo ========================================
echo 装修公司官网 - 数据库初始化向导
echo ========================================
echo.

REM 检查 Docker 是否安装
docker --version >nul 2>&1
if errorlevel 1 (
    echo [错误] 未检测到 Docker!
    echo.
    echo 请先安装 Docker Desktop:
    echo https://www.docker.com/products/docker-desktop/
    echo.
    pause
    exit /b 1
)

echo [1/5] 启动 PostgreSQL 容器...
docker-compose up -d
if errorlevel 1 (
    echo [错误] Docker 容器启动失败
    pause
    exit /b 1
)

echo.
echo [2/5] 等待数据库启动...
timeout /t 8 /nobreak >nul

echo.
echo [3/5] 检查容器状态...
docker-compose ps

echo.
echo [4/5] 初始化数据库表结构...
call npm run db:push
if errorlevel 1 (
    echo [错误] 数据库表初始化失败
    pause
    exit /b 1
)

echo.
echo [5/5] 填充示例数据...
call npm run db:seed
if errorlevel 1 (
    echo [警告] 示例数据填充失败 (可能已存在数据)
)

echo.
echo ========================================
echo 数据库设置完成!
echo ========================================
echo.
echo 连接信息:
echo   主机: localhost
echo   端口: 5432
echo   数据库: dcweb_db
echo   用户名: dcweb_user
echo   密码: dcweb_password_2024
echo.
echo 可用命令:
echo   npm run dev        - 启动开发服务器
echo   npm run db:studio  - 打开数据库管理界面
echo.
echo 按任意键启动开发服务器...
pause >nul

call npm run dev
