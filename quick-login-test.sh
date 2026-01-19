#!/bin/bash

BASE_URL="http://192.168.101.187:3600"
COOKIE_FILE="/tmp/test-cookies.txt"
rm -f "$COOKIE_FILE"

echo "============================================================"
echo "🔐 测试管理员登录功能"
echo "============================================================"
echo ""

# 获取CSRF Token
echo "1️⃣  获取CSRF Token..."
CSRF_RESPONSE=$(curl -s -c "$COOKIE_FILE" "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
echo "   ✅ Token: ${CSRF_TOKEN:0:30}..."
echo ""

# 测试登录
echo "2️⃣  测试登录 (admin / admin123)..."
LOGIN_RESULT=$(curl -s -b "$COOKIE_FILE" -c "$COOKIE_FILE" \
  -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=admin123&csrfToken=$CSRF_TOKEN&callbackUrl=$BASE_URL/admin&json=true" \
  "$BASE_URL/api/auth/callback/credentials")

if echo "$LOGIN_RESULT" | grep -q '"url"'; then
  REDIRECT_URL=$(echo "$LOGIN_RESULT" | grep -o '"url":"[^"]*"' | cut -d'"' -f4)
  if echo "$REDIRECT_URL" | grep -q "error"; then
    echo "   ❌ 登录失败: $REDIRECT_URL"
  else
    echo "   ✅ 登录成功!"
    echo "   📍 重定向: $REDIRECT_URL"
  fi
else
  echo "   ⚠️  响应: $LOGIN_RESULT"
fi
echo ""

# 验证会话
echo "3️⃣  验证会话状态..."
SESSION=$(curl -s -b "$COOKIE_FILE" "$BASE_URL/api/auth/session")
if echo "$SESSION" | grep -q '"user"'; then
  echo "   ✅ 会话有效!"
  echo "   👤 用户信息: $SESSION"
else
  echo "   ❌ 会话无效"
  echo "   响应: $SESSION"
fi
echo ""

# 测试错误密码
echo "4️⃣  测试错误密码 (应该失败)..."
CSRF_RESPONSE=$(curl -s -c "$COOKIE_FILE" "$BASE_URL/api/auth/csrf")
CSRF_TOKEN=$(echo "$CSRF_RESPONSE" | grep -o '"csrfToken":"[^"]*"' | cut -d'"' -f4)
WRONG_LOGIN=$(curl -s -b "$COOKIE_FILE" -c "$COOKIE_FILE" \
  -X POST \
  -H "Content-Type: application/x-www-form-urlencoded" \
  -d "username=admin&password=wrongpass&csrfToken=$CSRF_TOKEN&callbackUrl=$BASE_URL/admin&json=true" \
  "$BASE_URL/api/auth/callback/credentials")

if echo "$WRONG_LOGIN" | grep -q "error"; then
  echo "   ✅ 正确拒绝了错误密码"
else
  echo "   ❌ 安全问题: 错误密码被接受"
fi
echo ""

rm -f "$COOKIE_FILE"
echo "============================================================"
echo "✅ 测试完成!"
echo "============================================================"
echo ""
echo "📌 访问 http://192.168.101.187:3600/admin/login 进行手动测试"
echo "   用户名: admin"
echo "   密码: admin123"
