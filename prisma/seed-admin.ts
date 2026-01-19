import { PrismaClient } from '@prisma/client';
import { hash } from 'bcryptjs';
import { PrismaPg } from '@prisma/adapter-pg';
import { Pool } from 'pg';

// 创建 PostgreSQL 连接池
const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// 创建 Prisma adapter
const adapter = new PrismaPg(pool);

const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('开始创建管理员账户...');

  // 删除现有管理员(如果存在)
  await prisma.admin.deleteMany({});

  // 创建密码哈希
  const hashedPassword = await hash('admin123', 10);

  // 创建管理员账户
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: '系统管理员',
    },
  });

  console.log('✅ 管理员账户创建成功!');
  console.log('   用户名: admin');
  console.log('   密码: admin123');
  console.log('   ID:', admin.id);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error('❌ 创建管理员失败:', e);
    await prisma.$disconnect();
    process.exit(1);
  });
