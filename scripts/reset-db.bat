@echo off
REM 重置数据库 (删除所有数据并重新初始化)

echo ========================================
echo 警告: 此操作将删除所有数据库数据!
echo ========================================
echo.
set /p confirm="确认要重置数据库吗? (输入 YES 继续): "

if not "%confirm%"=="YES" (
    echo 操作已取消
    pause
    exit /b
)

echo.
echo 正在停止数据库...
docker-compose down -v

echo.
echo 正在启动数据库...
docker-compose up -d

echo.
echo 等待数据库启动...
timeout /t 5 /nobreak >nul

echo.
echo 正在初始化数据库表...
call npm run db:push

echo.
echo 正在填充示例数据...
call npm run db:seed

echo.
echo 数据库重置完成!
echo.
pause
