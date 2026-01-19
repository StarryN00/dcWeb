#!/bin/bash

# API 测试脚本
# 用途: 测试所有 API 端点是否正常工作

# 配置
API_BASE_URL="http://localhost:3600/api"

# 颜色定义
GREEN='\033[0;32m'
BLUE='\033[0;34m'
YELLOW='\033[1;33m'
RED='\033[0;31m'
CYAN='\033[0;36m'
NC='\033[0m' # No Color

# 测试计数
TOTAL_TESTS=0
PASSED_TESTS=0
FAILED_TESTS=0

# 函数: 打印消息
print_header() {
    echo ""
    echo -e "${CYAN}========================================${NC}"
    echo -e "${CYAN}$1${NC}"
    echo -e "${CYAN}========================================${NC}"
}

print_test() {
    echo -e "${BLUE}🧪 测试 $1${NC}"
}

print_success() {
    echo -e "${GREEN}✅ $1${NC}"
    ((PASSED_TESTS++))
}

print_error() {
    echo -e "${RED}❌ $1${NC}"
    ((FAILED_TESTS++))
}

print_info() {
    echo -e "${YELLOW}ℹ️  $1${NC}"
}

# 函数: 测试 API 端点
test_api() {
    local method=$1
    local endpoint=$2
    local data=$3
    local description=$4

    ((TOTAL_TESTS++))

    print_test "$description"

    if [ -z "$data" ]; then
        response=$(curl -s -w "\n%{http_code}" -X $method "${API_BASE_URL}${endpoint}")
    else
        response=$(curl -s -w "\n%{http_code}" -X $method \
            -H "Content-Type: application/json" \
            -d "$data" \
            "${API_BASE_URL}${endpoint}")
    fi

    http_code=$(echo "$response" | tail -n1)
    body=$(echo "$response" | head -n-1)

    echo "请求: $method ${API_BASE_URL}${endpoint}"
    echo "响应码: $http_code"
    echo "响应体: $body" | head -c 200
    echo ""

    if [ "$http_code" -ge 200 ] && [ "$http_code" -lt 300 ]; then
        print_success "测试通过 (HTTP $http_code)"
        echo "$body" > /tmp/last_response.json
        return 0
    else
        print_error "测试失败 (HTTP $http_code)"
        return 1
    fi
}

# 主测试流程
main() {
    print_header "API 端点测试"

    # 检查服务器是否运行
    print_info "检查开发服务器..."
    if ! curl -s http://localhost:3600 > /dev/null; then
        print_error "开发服务器未运行! 请先执行: npm run dev"
        exit 1
    fi
    print_success "开发服务器正在运行"

    # 检查数据库连接
    print_info "检查数据库连接..."
    cd /mnt/d/AIProgram/dcWeb
    if ! npx prisma db pull > /dev/null 2>&1; then
        print_error "数据库连接失败! 请确保 PostgreSQL 已启动"
        exit 1
    fi
    print_success "数据库连接正常"

    # ==================== 案例 API 测试 ====================
    print_header "案例 API 测试"

    # 1. GET /api/cases - 获取案例列表
    test_api "GET" "/cases" "" "获取案例列表"

    # 2. POST /api/cases - 创建案例
    case_data='{
        "title": "测试案例 - 现代简约风格",
        "location": "北京 · 朝阳区",
        "style": "modern",
        "area": 120,
        "duration": 60,
        "price": 25.5,
        "images": ["https://via.placeholder.com/800x600"],
        "description": "这是一个测试案例,采用现代简约风格设计",
        "testimonial": "装修效果非常满意,施工队专业负责",
        "foremanName": "张师傅",
        "foremanPhone": "13800138000",
        "stage": "完工阶段",
        "featured": true,
        "status": "published"
    }'

    if test_api "POST" "/cases" "$case_data" "创建新案例"; then
        # 从响应中提取案例ID
        case_id=$(cat /tmp/last_response.json | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        print_info "创建的案例ID: $case_id"

        # 3. GET /api/cases/[id] - 获取案例详情
        if [ -n "$case_id" ]; then
            test_api "GET" "/cases/$case_id" "" "获取案例详情 (ID: $case_id)"

            # 4. PUT /api/cases/[id] - 更新案例
            update_data='{"title": "测试案例 - 已更新", "featured": false}'
            test_api "PUT" "/cases/$case_id" "$update_data" "更新案例 (ID: $case_id)"

            # 5. DELETE /api/cases/[id] - 删除案例 (先跳过,最后删除)
            # test_api "DELETE" "/cases/$case_id" "" "删除案例 (ID: $case_id)"
        fi
    fi

    # 6. GET /api/cases with filters - 测试筛选功能
    test_api "GET" "/cases?style=modern" "" "按风格筛选案例"
    test_api "GET" "/cases?minArea=100&maxArea=200" "" "按面积范围筛选案例"
    test_api "GET" "/cases?featured=true" "" "获取推荐案例"

    # ==================== 潜客 API 测试 ====================
    print_header "潜客 API 测试"

    # 7. POST /api/leads - 提交潜客信息
    lead_data='{
        "name": "测试用户",
        "phone": "13800138000",
        "propertyType": "apartment",
        "area": 120,
        "budget": 30,
        "styles": ["modern", "nordic"],
        "stage": "design_and_construction",
        "timeline": "within_1_month"
    }'

    if test_api "POST" "/leads" "$lead_data" "提交潜客信息"; then
        # 从响应中提取潜客ID和评分
        lead_id=$(cat /tmp/last_response.json | grep -o '"id":"[^"]*"' | head -1 | cut -d'"' -f4)
        lead_score=$(cat /tmp/last_response.json | grep -o '"score":[0-9]*' | head -1 | cut -d':' -f2)
        print_info "创建的潜客ID: $lead_id"
        print_info "自动评分: $lead_score 分"

        # 8. GET /api/leads - 获取潜客列表
        test_api "GET" "/leads" "" "获取潜客列表"

        # 9. GET /api/leads/[id] - 获取潜客详情
        if [ -n "$lead_id" ]; then
            test_api "GET" "/leads/$lead_id" "" "获取潜客详情 (ID: $lead_id)"

            # 10. PUT /api/leads/[id] - 更新潜客状态
            update_lead='{"status": "contacted"}'
            test_api "PUT" "/leads/$lead_id" "$update_lead" "更新潜客状态 (ID: $lead_id)"

            # 11. DELETE /api/leads/[id] - 删除潜客
            test_api "DELETE" "/leads/$lead_id" "" "删除潜客 (ID: $lead_id)"
        fi
    fi

    # 12. GET /api/leads with filters - 测试筛选功能
    test_api "GET" "/leads?status=pending" "" "按状态筛选潜客"
    test_api "GET" "/leads?minScore=80" "" "筛选高分潜客"
    test_api "GET" "/leads?sortBy=score&order=desc" "" "按评分排序潜客"

    # ==================== 错误处理测试 ====================
    print_header "错误处理测试"

    # 13. 测试 404 错误
    test_api "GET" "/cases/invalid-id" "" "测试案例不存在 (404)"
    test_api "GET" "/leads/invalid-id" "" "测试潜客不存在 (404)"

    # 14. 测试 400 错误 - 缺少必填字段
    invalid_case='{"title": "只有标题"}'
    test_api "POST" "/cases" "$invalid_case" "测试缺少必填字段 (400)"

    # 15. 测试 400 错误 - 无效数据
    invalid_lead='{"name": "测试", "phone": "12345", "area": -100}'
    test_api "POST" "/leads" "$invalid_lead" "测试无效数据 (400)"

    # ==================== 清理测试数据 ====================
    print_header "清理测试数据"

    # 删除创建的测试案例
    if [ -n "$case_id" ]; then
        test_api "DELETE" "/cases/$case_id" "" "删除测试案例"
    fi

    # ==================== 测试总结 ====================
    print_header "测试总结"

    echo ""
    echo "总测试数: $TOTAL_TESTS"
    echo -e "${GREEN}通过: $PASSED_TESTS${NC}"
    echo -e "${RED}失败: $FAILED_TESTS${NC}"
    echo ""

    if [ $FAILED_TESTS -eq 0 ]; then
        echo -e "${GREEN}========================================${NC}"
        echo -e "${GREEN}🎉 所有测试通过!${NC}"
        echo -e "${GREEN}========================================${NC}"
        exit 0
    else
        echo -e "${RED}========================================${NC}"
        echo -e "${RED}❌ 有 $FAILED_TESTS 个测试失败${NC}"
        echo -e "${RED}========================================${NC}"
        exit 1
    fi
}

# 运行测试
main
