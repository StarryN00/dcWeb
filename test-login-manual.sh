#!/bin/bash

# 管理员登录功能手动测试脚本
# 使用 curl 模拟浏览器行为进行登录测试

BASE_URL="http://localhost:3600"
COOKIE_FILE="/tmp/test-login-cookies.txt"

echo "============================================================"
echo "🚀 管理员登录功能测试"
echo "============================================================"
echo ""

# 清理旧的Cookie文件
rm -f "$COOKIE_FILE"

# 测试1: 检查服务器状态
echo "📡 测试 1/6: 检查服务器状态..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL")
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ 服务器运行正常 (HTTP $HTTP_CODE)"
else
    echo "   ❌ 服务器异常 (HTTP $HTTP_CODE)"
    echo "   请运行: npm run dev"
    exit 1
fi
echo ""

# 测试2: 检查登录页面
echo "📄 测试 2/6: 检查登录页面..."
HTTP_CODE=$(curl -s -o /dev/null -w "%{http_code}" "$BASE_URL/admin/login")
if [ "$HTTP_CODE" = "200" ]; then
    echo "   ✅ 登录页面可访问 (HTTP $HTTP_CODE)"
else
    echo "   ⚠️  登录页面返回 HTTP $HTTP_CODE"
fi
echo ""

# 测试3: 检查数据库连接
echo "📊 测试 3/6: 检查数据库连接..."
DB_RESPONSE=$(curl -s "$BASE_URL/api/cases")
if echo "$DB_RESPONSE" | grep -q "error"; then
    echo "   ❌ 数据库连接失败"
    echo "   错误信息: $DB_RESPONSE"
    echo "   请运行: npm run db:start && npm run db:push"
else
    echo "   ✅ 数据库连接正常"
fi
echo ""

# 测试4: 获取CSRF Token
echo "🔐 测试 4/6: 获取CSRF Token..."
CSRF_RESPONSE=$(curl -s -c "$COOKIE_FILE" "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

if [ -n "$CSRF_TOKEN" ]; then
    echo "   ✅ 成功获取CSRF Token"
    echo "   Token: ${CSRF_TOKEN:0:20}..."
else
    echo "   ❌ 无法获取CSRF Token"
    echo "   响应: $CSRF_RESPONSE"
    exit 1
fi
echo ""

# 测试5: 尝试登录 - 正确的凭据
echo "🔑 测试 5/6: 使用正确的凭据登录..."
echo "   用户名: admin"
echo "   密码: admin123"

LOGIN_RESPONSE=$(curl -s \
    -b "$COOKIE_FILE" \
    -c "$COOKIE_FILE" \
    -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin&password=admin123&csrfToken=$CSRF_TOKEN&callbackUrl=$BASE_URL/admin&json=true" \
    -w "\nHTTP_CODE:%{http_code}" \
    "$BASE_URL/api/auth/callback/credentials")

HTTP_CODE=$(echo "$LOGIN_RESPONSE" | grep "HTTP_CODE" | cut -d':' -f2)
RESPONSE_BODY=$(echo "$LOGIN_RESPONSE" | grep -v "HTTP_CODE")

echo "   HTTP状态码: $HTTP_CODE"

if echo "$RESPONSE_BODY" | grep -q '"url"'; then
    REDIRECT_URL=$(echo "$RESPONSE_BODY" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
    if echo "$REDIRECT_URL" | grep -q "error"; then
        echo "   ❌ 登录失败"
        echo "   重定向: $REDIRECT_URL"
    else
        echo "   ✅ 登录成功"
        echo "   重定向: $REDIRECT_URL"
    fi
else
    echo "   ⚠️  响应格式异常"
    echo "   响应内容: $RESPONSE_BODY"
fi
echo ""

# 测试6: 验证会话
echo "🎫 测试 6/6: 验证会话状态..."
SESSION_RESPONSE=$(curl -s -b "$COOKIE_FILE" "$BASE_URL/api/auth/session")
echo "   会话信息: $SESSION_RESPONSE"

if echo "$SESSION_RESPONSE" | grep -q '"user"'; then
    echo "   ✅ 会话有效,用户已登录"
else
    echo "   ❌ 会话无效或用户未登录"
fi
echo ""

# 额外测试: 错误的密码
echo "🔒 额外测试: 使用错误的密码..."
echo "   用户名: admin"
echo "   密码: wrongpassword"

# 重新获取CSRF Token
CSRF_RESPONSE=$(curl -s -c "$COOKIE_FILE" "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)

WRONG_LOGIN=$(curl -s \
    -b "$COOKIE_FILE" \
    -c "$COOKIE_FILE" \
    -X POST \
    -H "Content-Type: application/x-www-form-urlencoded" \
    -d "username=admin&password=wrongpassword&csrfToken=$CSRF_TOKEN&callbackUrl=$BASE_URL/admin&json=true" \
    "$BASE_URL/api/auth/callback/credentials")

if echo "$WRONG_LOGIN" | grep -q "error"; then
    echo "   ✅ 正确拒绝了错误的密码"
else
    echo "   ❌ 安全问题:错误的密码被接受"
fi
echo ""

# 清理
rm -f "$COOKIE_FILE"

echo "============================================================"
echo "✅ 测试完成"
echo "============================================================"
echo ""
echo "💡 提示:"
echo "   - 如果数据库测试失败,请运行: npm run db:start"
echo "   - 如果需要初始化数据库: npm run db:push && npm run db:seed"
echo "   - 查看管理员账户: npx prisma studio"
echo ""
