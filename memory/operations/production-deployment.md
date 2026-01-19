# dcWeb 生产环境部署和更新操作指南

## 📋 概述

本文档记录 dcWeb 装修公司官网项目的生产环境部署和更新流程，用于日常代码更新、编译和部署操作。

---

## 🔐 服务器信息

- **服务器 IP**: 139.196.28.125
- **SSH 用户**: root
- **SSH 私钥**: `server/AIservier.pem`（本地路径）或 `/tmp/dcweb_key.pem`（WSL 临时路径）
- **项目路径**: `/var/www/dcWeb`
- **域名**: https://dcweb.worknoya.vip

---

## 🚀 生产环境更新流程

### 前提条件

1. 本地代码已提交到 Git
2. 已推送到 GitHub 主分支
3. SSH 私钥文件权限正确（600）

### 标准更新步骤

#### 1. 准备 SSH 密钥（WSL 环境）

```bash
# 在本地项目目录执行
cp server/AIservier.pem /tmp/dcweb_key.pem
chmod 600 /tmp/dcweb_key.pem
```

#### 2. 连接到服务器

```bash
ssh -i /tmp/dcweb_key.pem root@139.196.28.125
```

#### 3. 进入项目目录

```bash
cd /var/www/dcWeb
```

#### 4. 备份当前环境变量（重要！）

```bash
cp .env.production .env.production.backup
```

#### 5. 更新代码

**方法 A: 使用本地打包上传（推荐，网络稳定）**

```bash
# 在本地执行（WSL）
cd /mnt/d/AIProgram/dcWeb
tar czf /tmp/dcweb.tar.gz --exclude='.git' --exclude='node_modules' --exclude='.next' --exclude='*.pem' .

# 上传到服务器
scp -i /tmp/dcweb_key.pem /tmp/dcweb.tar.gz root@139.196.28.125:/var/www/dcWeb/

# 在服务器上解压
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'cd /var/www/dcWeb && tar xzf dcweb.tar.gz && rm dcweb.tar.gz'

# 恢复环境变量
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'cd /var/www/dcWeb && mv .env.production.backup .env.production'
```

**方法 B: Git 拉取（如果服务器网络正常）**

```bash
# 在服务器上执行
cd /var/www/dcWeb
git stash  # 暂存本地修改（如有）
git pull origin main
git stash pop  # 恢复本地修改（如有）
```

#### 6. 安装/更新依赖

```bash
# 在服务器上执行
npm ci --production=false
```

#### 7. 同步数据库结构（如果有 schema 变更）

```bash
NODE_ENV=production npm run db:push
```

**⚠️ 注意**:
- 如果有破坏性变更，先备份数据库
- 如果需要数据迁移，手动执行迁移脚本

#### 8. 生成 Prisma 客户端（如果有 schema 变更）

```bash
npx prisma generate
```

#### 9. 重启应用

```bash
pm2 restart dcweb
```

#### 10. 查看应用状态和日志

```bash
# 查看进程状态
pm2 status

# 查看实时日志（Ctrl+C 退出）
pm2 logs dcweb --lines 50

# 或查看最近日志（不跟随）
pm2 logs dcweb --lines 50 --nostream
```

#### 11. 验证部署

```bash
# 测试本地访问
curl -I http://localhost:3600

# 测试 HTTPS 访问
curl -I https://dcweb.worknoya.vip

# 或在浏览器中访问
# https://dcweb.worknoya.vip
```

---

## 🔄 快速更新脚本

为了简化更新流程，可以使用以下一键脚本：

### 在本地创建更新脚本

```bash
# 创建 deploy-to-production.sh
cat > deploy-to-production.sh <<'EOF'
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
EOF

chmod +x deploy-to-production.sh
```

### 使用一键脚本

```bash
# 在本地项目目录执行
./deploy-to-production.sh
```

---

## 🗄️ 数据库操作

### 备份数据库

```bash
# 手动备份
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 '/var/www/dcWeb/backup-db.sh'

# 查看备份文件
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'ls -lh /var/backups/dcweb/'
```

### 恢复数据库

```bash
# 1. 找到备份文件
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'ls -lh /var/backups/dcweb/'

# 2. 解压备份
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'gunzip /var/backups/dcweb/dcweb_db_YYYYMMDD_HHMMSS.sql.gz'

# 3. 恢复数据
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'docker exec -i dcweb_postgres psql -U dcweb_user -d dcweb_db < /var/backups/dcweb/dcweb_db_YYYYMMDD_HHMMSS.sql'
```

### 数据库迁移

```bash
# 如果有 schema 变更
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'cd /var/www/dcWeb && NODE_ENV=production npm run db:push'
```

---

## 🔍 故障排查

### 应用无法启动

```bash
# 查看详细日志
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'pm2 logs dcweb --lines 100'

# 查看错误日志
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'cat /var/www/dcWeb/logs/pm2-error.log'

# 重启应用
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'pm2 restart dcweb'

# 如果需要完全停止后重启
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'pm2 stop dcweb && pm2 start dcweb'
```

### 数据库连接失败

```bash
# 检查容器状态
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'docker ps | grep dcweb_postgres'

# 查看容器日志
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'docker logs dcweb_postgres --tail 50'

# 重启容器
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'docker restart dcweb_postgres'
```

### Nginx 502 错误

```bash
# 检查应用是否运行
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'pm2 status'

# 检查端口 3600 是否监听
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'curl -I http://localhost:3600'

# 查看 Nginx 错误日志
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'tail -f /var/log/nginx/dcweb_error.log'

# 重启 Nginx
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'systemctl restart nginx'
```

### 依赖安装失败

```bash
# 清理缓存重装
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'cd /var/www/dcWeb && rm -rf node_modules package-lock.json && npm install'
```

---

## 📊 监控和日志

### 查看实时日志

```bash
# PM2 应用日志
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'pm2 logs dcweb'

# Nginx 访问日志
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'tail -f /var/log/nginx/dcweb_access.log'

# Nginx 错误日志
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'tail -f /var/log/nginx/dcweb_error.log'

# Docker 容器日志
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 'docker logs -f dcweb_postgres'
```

### 系统状态检查

```bash
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 << 'EOF'
echo "===== 系统状态检查 ====="

echo -e "\n1. PM2 进程状态:"
pm2 status

echo -e "\n2. Docker 容器状态:"
docker ps --format "table {{.Names}}\t{{.Status}}\t{{.Ports}}"

echo -e "\n3. 磁盘使用:"
df -h | grep -E "Filesystem|/var"

echo -e "\n4. 内存使用:"
free -h

echo -e "\n5. Nginx 状态:"
systemctl status nginx | grep -E "Active|Main PID"

echo -e "\n6. 应用访问测试:"
curl -sI http://localhost:3600 | head -3
EOF
```

---

## 🔐 安全注意事项

1. **SSH 密钥安全**
   - ⚠️ 私钥文件 `server/AIservier.pem` 已加入 `.gitignore`
   - ⚠️ 不要将私钥提交到 Git 仓库
   - ⚠️ 确保私钥文件权限为 600

2. **环境变量保护**
   - ✅ `.env.production` 仅存在于服务器
   - ✅ 每次更新前先备份环境变量
   - ✅ 更新后立即恢复环境变量

3. **数据库安全**
   - ✅ 重要操作前先备份数据库
   - ✅ 定时备份已配置（每天凌晨2点）
   - ✅ 备份保留 7 天

4. **管理员密码**
   - ⚠️ 默认密码: admin / admin123
   - ⚠️ 生产环境必须修改默认密码

---

## 📝 检查清单

部署前检查：
- [ ] 本地代码已提交并推送到 GitHub
- [ ] 数据库 schema 变更已记录
- [ ] 重要数据已备份
- [ ] 测试环境已验证新功能

部署后验证：
- [ ] PM2 显示应用状态为 online
- [ ] 本地访问 `http://localhost:3600` 返回 200
- [ ] HTTPS 访问 `https://dcweb.worknoya.vip` 正常
- [ ] 数据库连接正常
- [ ] 日志中无严重错误
- [ ] 浏览器测试关键功能

---

## 🆘 紧急回滚

如果部署出现严重问题：

```bash
ssh -i /tmp/dcweb_key.pem root@139.196.28.125 << 'EOF'
cd /var/www/dcWeb

# 1. 停止应用
pm2 stop dcweb

# 2. 回滚代码到上一个版本（如果使用 Git）
# git reset --hard HEAD~1

# 3. 恢复数据库（如有备份）
# gunzip /var/backups/dcweb/dcweb_db_YYYYMMDD_HHMMSS.sql.gz
# docker exec -i dcweb_postgres psql -U dcweb_user -d dcweb_db < /var/backups/dcweb/dcweb_db_YYYYMMDD_HHMMSS.sql

# 4. 重新安装依赖
npm ci --production=false

# 5. 重启应用
pm2 restart dcweb
EOF
```

---

## 📞 关键命令速查

| 操作 | 命令 |
|------|------|
| 连接服务器 | `ssh -i /tmp/dcweb_key.pem root@139.196.28.125` |
| 查看应用状态 | `pm2 status` |
| 重启应用 | `pm2 restart dcweb` |
| 查看日志 | `pm2 logs dcweb` |
| 备份数据库 | `/var/www/dcWeb/backup-db.sh` |
| 查看容器状态 | `docker ps` |
| 重启容器 | `docker restart dcweb_postgres` |
| 测试本地访问 | `curl -I http://localhost:3600` |
| 测试 HTTPS | `curl -I https://dcweb.worknoya.vip` |

---

## 🔗 相关文档

- 项目部署计划: `/home/starryn/.claude/plans/cheerful-watching-summit.md`
- 服务器信息: `server/server.txt`
- Docker 配置: `docker-compose.yml`
- PM2 配置: `ecosystem.config.js`
- Nginx 配置: `/etc/nginx/sites-available/dcweb.conf`

---

**最后更新**: 2026-01-19
**维护者**: Claude Code
**版本**: 1.0
