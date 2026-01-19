#!/bin/bash
# dcWeb 生产环境一键部署脚本

set -e  # 遇到错误立即退出

echo "🚀 开始部署 dcWeb 到生产环境..."

# 1. 检查 Git 状态
if [[ -n $(git status -s) ]]; then
    echo "⚠️  检测到未提交的更改，请先提交代码"
    git status -s
    exit 1
fi

# 2. 推送到 GitHub
echo "📤 推送代码到 GitHub..."
git push origin main

# 3. 准备 SSH 密钥
echo "🔑 准备 SSH 密钥..."
cp server/AIservier.pem /tmp/dcweb_key.pem
chmod 600 /tmp/dcweb_key.pem

# 4. 打包项目
echo "📦 打包项目文件..."
tar czf /tmp/dcweb.tar.gz --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='*.pem' .

# 5. 上传到服务器
echo "📤 上传到服务器..."
scp -i /tmp/dcweb_key.pem /tmp/dcweb.tar.gz root@139.196.28.125:/var/www/dcWeb/

# 6. 在服务器上执行更新
echo "🔧 在服务器上更新..."
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 << 'ENDSSH'
cd /var/www/dcWeb

# 备份环境变量
cp .env.production .env.production.backup

# 解压新代码
tar xzf dcweb.tar.gz
rm dcweb.tar.gz

# 恢复环境变量
mv .env.production.backup .env.production

# 安装依赖
echo "📦 安装依赖..."
npm ci --production=false

# 生成 Prisma 客户端
echo "🔄 生成 Prisma 客户端..."
npx prisma generate

# 同步数据库（如需要）
# NODE_ENV=production npm run db:push

# 重启应用
echo "♻️  重启应用..."
pm2 restart dcweb

# 查看状态
echo "📊 应用状态:"
pm2 status | grep dcweb

echo "✅ 部署完成!"
ENDSSH

# 7. 验证部署
echo "🧪 验证部署..."
sleep 5
curl -sI https://dcweb.worknoya.vip | grep -E "HTTP|Server"

echo ""
echo "✅ 部署完成！"
echo "🌐 访问地址: https://dcweb.worknoya.vip"
echo "📊 查看日志: ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'pm2 logs dcweb'"
