#!/bin/bash

# PostgreSQL 数据库管理脚本

SCRIPTS_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPTS_DIR")"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
NC='\033[0m' # No Color

# 函数: 打印带颜色的消息
print_success() {
    echo -e "${GREEN}✅ $1${NC}"
}

print_info() {
    echo -e "${BLUE}ℹ️  $1${NC}"
}

print_warning() {
    echo -e "${YELLOW}⚠️  $1${NC}"
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
}

# 函数: 检查 PostgreSQL 是否已安装
check_postgres_installed() {
    if command -v psql &> /dev/null; then
        print_success "PostgreSQL 已安装"
        psql --version
        return 0
    else
        print_warning "PostgreSQL 未安装"
        return 1
    fi
}

# 函数: 检查 PostgreSQL 服务状态
check_postgres_status() {
    if sudo service postgresql status &> /dev/null; then
        print_success "PostgreSQL 服务正在运行"
        return 0
    else
        print_warning "PostgreSQL 服务未运行"
        return 1
    fi
}

# 函数: 启动 PostgreSQL 服务
start_postgres() {
    print_info "正在启动 PostgreSQL 服务..."
    sudo service postgresql start
    if [ $? -eq 0 ]; then
        print_success "PostgreSQL 服务已启动"
    else
        print_error "启动 PostgreSQL 服务失败"
        exit 1
    fi
}

# 函数: 停止 PostgreSQL 服务
stop_postgres() {
    print_info "正在停止 PostgreSQL 服务..."
    sudo service postgresql stop
    if [ $? -eq 0 ]; then
        print_success "PostgreSQL 服务已停止"
    else
        print_error "停止 PostgreSQL 服务失败"
        exit 1
    fi
}

# 函数: 重启 PostgreSQL 服务
restart_postgres() {
    print_info "正在重启 PostgreSQL 服务..."
    sudo service postgresql restart
    if [ $? -eq 0 ]; then
        print_success "PostgreSQL 服务已重启"
    else
        print_error "重启 PostgreSQL 服务失败"
        exit 1
    fi
}

# 函数: 初始化数据库
init_database() {
    print_info "正在初始化数据库..."

    if [ ! -f "$SCRIPTS_DIR/init-database.sql" ]; then
        print_error "找不到初始化脚本: $SCRIPTS_DIR/init-database.sql"
        exit 1
    fi

    sudo -u postgres psql -f "$SCRIPTS_DIR/init-database.sql"

    if [ $? -eq 0 ]; then
        print_success "数据库初始化完成"
        print_info ""
        print_info "下一步: 更新 .env 文件"
        print_info "DATABASE_URL=\"postgresql://dcweb_admin:dcweb_password_2026@localhost:5432/dcweb_db?schema=public\""
    else
        print_error "数据库初始化失败"
        exit 1
    fi
}

# 函数: 运行 Prisma 迁移
run_prisma_migration() {
    print_info "正在运行 Prisma 迁移..."
    cd "$PROJECT_DIR"
    npx prisma db push

    if [ $? -eq 0 ]; then
        print_success "Prisma 迁移完成"
    else
        print_error "Prisma 迁移失败"
        exit 1
    fi
}

# 函数: 打开 Prisma Studio
open_prisma_studio() {
    print_info "正在打开 Prisma Studio..."
    cd "$PROJECT_DIR"
    npx prisma studio
}

# 函数: 显示帮助信息
show_help() {
    echo ""
    echo "PostgreSQL 数据库管理脚本"
    echo ""
    echo "用法: $0 [命令]"
    echo ""
    echo "命令:"
    echo "  status      - 检查 PostgreSQL 状态"
    echo "  start       - 启动 PostgreSQL 服务"
    echo "  stop        - 停止 PostgreSQL 服务"
    echo "  restart     - 重启 PostgreSQL 服务"
    echo "  init        - 初始化数据库(创建数据库和用户)"
    echo "  migrate     - 运行 Prisma 迁移"
    echo "  studio      - 打开 Prisma Studio"
    echo "  help        - 显示此帮助信息"
    echo ""
    echo "示例:"
    echo "  $0 status     # 检查状态"
    echo "  $0 start      # 启动服务"
    echo "  $0 init       # 初始化数据库"
    echo "  $0 migrate    # 运行迁移"
    echo ""
}

# 主程序
main() {
    case "$1" in
        status)
            check_postgres_installed
            check_postgres_status
            ;;
        start)
            check_postgres_installed || exit 1
            start_postgres
            ;;
        stop)
            check_postgres_installed || exit 1
            stop_postgres
            ;;
        restart)
            check_postgres_installed || exit 1
            restart_postgres
            ;;
        init)
            check_postgres_installed || exit 1
            check_postgres_status || start_postgres
            init_database
            ;;
        migrate)
            check_postgres_installed || exit 1
            check_postgres_status || start_postgres
            run_prisma_migration
            ;;
        studio)
            check_postgres_installed || exit 1
            check_postgres_status || start_postgres
            open_prisma_studio
            ;;
        help|--help|-h)
            show_help
            ;;
        *)
            print_error "未知命令: $1"
            show_help
            exit 1
            ;;
    esac
}

# 如果没有参数,显示帮助
if [ $# -eq 0 ]; then
    show_help
    exit 0
fi

# 运行主程序
main "$@"
