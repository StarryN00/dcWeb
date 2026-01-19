import { hash } from 'bcryptjs';
import { prisma } from '../lib/prisma';

async function main() {
  console.log('开始创建种子数据...');

  // 清空现有数据(可选)
  console.log('清空现有数据...');
  await prisma.lead.deleteMany({});
  await prisma.case.deleteMany({});
  await prisma.admin.deleteMany({});

  // 创建管理员用户
  console.log('创建管理员用户...');
  const hashedPassword = await hash('admin123', 10);
  const admin = await prisma.admin.create({
    data: {
      username: 'admin',
      password: hashedPassword,
      name: '系统管理员',
    },
  });
  console.log(`✅ 管理员创建成功: ${admin.name}`);

  // 创建示例案例
  console.log('创建示例案例...');

  const cases = [
    {
      title: '现代简约 · 120㎡两居室',
      location: '北京 · 朝阳区',
      style: 'modern',
      area: 120,
      duration: 60,
      price: 25.0,
      images: [
        'https://images.unsplash.com/photo-1600210492493-0946911123ea?w=800',
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
      ],
      description:
        '本案例采用现代简约风格,以白色和灰色为主色调,搭配木质元素,营造出简洁舒适的居住空间。开放式厨房与客厅相连,增加了空间的通透感。',
      testimonial:
        '张师傅的团队非常专业,从设计到施工都很细心。工期控制得很好,装修质量也让我们很满意。现在住进来感觉非常舒适,感谢团队的辛勤付出!',
      foremanName: '张伟',
      foremanPhone: '13800138001',
      stage: '完工阶段',
      featured: true,
      status: 'published',
    },
    {
      title: '北欧风格 · 95㎡温馨小家',
      location: '上海 · 浦东新区',
      style: 'nordic',
      area: 95,
      duration: 50,
      price: 20.0,
      images: [
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
        'https://images.unsplash.com/photo-1600573472591-ee6b68d14c68?w=800',
        'https://images.unsplash.com/photo-1600566753086-00f18fb6b3ea?w=800',
      ],
      description:
        '北欧风格设计,追求简洁与自然的完美结合。大量使用白色和原木色,搭配绿植点缀,打造温馨舒适的居住环境。充足的采光和合理的收纳设计是本案例的亮点。',
      testimonial:
        '李师傅很有经验,给了我们很多实用的建议。装修过程中遇到的问题都及时解决了,最终效果比预期还要好。推荐!',
      foremanName: '李强',
      foremanPhone: '13800138002',
      stage: '完工阶段',
      featured: true,
      status: 'published',
    },
    {
      title: '工业风 · 150㎡loft公寓',
      location: '深圳 · 南山区',
      style: 'industrial',
      area: 150,
      duration: 75,
      price: 35.0,
      images: [
        'https://images.unsplash.com/photo-1600566753190-17f0baa2a6c3?w=800',
        'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?w=800',
        'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?w=800',
      ],
      description:
        '工业风格设计,保留原始混凝土墙面和裸露管道,搭配金属和木质家具。挑高设计配合吊灯,营造出独特的艺术氛围。适合追求个性的年轻人。',
      testimonial:
        '王师傅的施工队特别专业,对工业风的理解很到位。水电改造做得很规范,细节处理也很用心。整体效果非常满意!',
      foremanName: '王建国',
      foremanPhone: '13800138003',
      stage: '完工阶段',
      featured: true,
      status: 'published',
    },
    {
      title: '侘寂风 · 110㎡禅意空间',
      location: '杭州 · 西湖区',
      style: 'wabisabi',
      area: 110,
      duration: 65,
      price: 28.0,
      images: [
        'https://images.unsplash.com/photo-1600121848594-d8644e57abab?w=800',
        'https://images.unsplash.com/photo-1600047509807-ba8f99d2cdde?w=800',
        'https://images.unsplash.com/photo-1600210491892-03d54c0aaf87?w=800',
      ],
      description:
        '侘寂美学,追求自然、简朴与不完美的美。使用天然材质,保留手工痕迹,营造宁静的禅意空间。色调以米色、灰色、原木色为主。',
      testimonial:
        '刘师傅对侘寂风格有很深的理解,施工过程中注重每一个细节。装修后的家让人感觉特别平静,非常适合生活。',
      foremanName: '刘明',
      foremanPhone: '13800138004',
      stage: '完工阶段',
      featured: false,
      status: 'published',
    },
    {
      title: '轻奢风格 · 180㎡豪华三居',
      location: '广州 · 天河区',
      style: 'luxury',
      area: 180,
      duration: 90,
      price: 50.0,
      images: [
        'https://images.unsplash.com/photo-1600607686527-6fb886090705?w=800&q=80',
        'https://images.unsplash.com/photo-1600607686434-0cb4250ee8e8?w=800&q=80',
        'https://images.unsplash.com/photo-1600607687920-4e2a09cf159d?w=800&q=80',
      ],
      description:
        '轻奢风格设计,融合现代与古典元素。使用大理石、黄铜、丝绒等高级材质,营造精致优雅的居住环境。注重细节与质感的完美呈现。',
      testimonial:
        '陈师傅的团队施工质量非常高,对材料的把控很严格。装修效果超出预期,每个细节都做得很到位。值得信赖!',
      foremanName: '陈建华',
      foremanPhone: '13800138005',
      stage: '完工阶段',
      featured: true,
      status: 'published',
    },
    {
      title: '极简风格 · 85㎡单身公寓',
      location: '成都 · 高新区',
      style: 'minimalist',
      area: 85,
      duration: 45,
      price: 18.0,
      images: [
        'https://images.unsplash.com/photo-1600585154526-990dced4db0d?w=800',
        'https://images.unsplash.com/photo-1600573472550-8090b5e0745e?w=800',
        'https://images.unsplash.com/photo-1600566752355-35792bedcfea?w=800',
      ],
      description:
        '极简主义设计,去除一切多余装饰,追求功能性与美感的统一。大面积留白,简洁的线条,营造宁静舒适的空间。',
      testimonial:
        '赵师傅很理解我对极简的追求,没有做任何多余的装饰。施工速度快,质量也很好。住进来感觉很舒服!',
      foremanName: '赵磊',
      foremanPhone: '13800138006',
      stage: '完工阶段',
      featured: false,
      status: 'published',
    },
  ];

  for (const caseData of cases) {
    const createdCase = await prisma.case.create({ data: caseData });
    console.log(`✅ 案例创建成功: ${createdCase.title}`);
  }

  // 创建示例潜客
  console.log('创建示例潜客...');

  const leads = [
    {
      name: '张三',
      phone: '13800138101',
      propertyType: 'apartment',
      area: 120,
      budget: 30,
      styles: ['modern', 'nordic'],
      stage: 'design_construction',
      timeline: 'within_1_month',
      score: 90, // 高分潜客
      status: 'pending',
    },
    {
      name: '李四',
      phone: '13800138102',
      propertyType: 'villa',
      area: 200,
      budget: 50,
      styles: ['luxury', 'chinese'],
      stage: 'design_construction',
      timeline: 'within_1_month',
      score: 100, // A级潜客
      status: 'contacted',
    },
    {
      name: '王五',
      phone: '13800138103',
      propertyType: 'residential',
      area: 95,
      budget: 20,
      styles: ['minimalist'],
      stage: 'design_only',
      timeline: 'within_1_3_months',
      score: 77, // B级潜客
      status: 'pending',
    },
    {
      name: '赵六',
      phone: '13800138104',
      propertyType: 'apartment',
      area: 80,
      budget: 15,
      styles: ['modern', 'industrial'],
      stage: 'construction_only',
      timeline: 'within_3_6_months',
      score: 69, // C级潜客
      status: 'contacted',
    },
    {
      name: '孙七',
      phone: '13800138105',
      propertyType: 'commercial',
      area: 150,
      budget: 40,
      styles: ['industrial', 'modern'],
      stage: 'design_construction',
      timeline: 'within_1_3_months',
      score: 92, // A级潜客
      status: 'scheduled',
    },
    {
      name: '周八',
      phone: '13800138106',
      propertyType: 'residential',
      area: 100,
      budget: 25,
      styles: ['nordic', 'wabisabi'],
      stage: 'supervision_only',
      timeline: 'over_6_months',
      score: 73, // B级潜客
      status: 'pending',
    },
  ];

  for (const leadData of leads) {
    const createdLead = await prisma.lead.create({ data: leadData });
    console.log(`✅ 潜客创建成功: ${createdLead.name} (评分: ${createdLead.score})`);
  }

  console.log('');
  console.log('========================================');
  console.log('🎉 种子数据创建完成!');
  console.log('========================================');
  console.log('');
  console.log('📊 创建的数据:');
  console.log(`- 管理员: 1 个`);
  console.log(`- 案例: ${cases.length} 个`);
  console.log(`- 潜客: ${leads.length} 个`);
  console.log('');
  console.log('💡 下一步:');
  console.log('1. 启动开发服务器: npm run dev');
  console.log('2. 打开 Prisma Studio: npx prisma studio');
  console.log('3. 访问 http://localhost:3600/api/cases 查看案例');
  console.log('4. 访问 http://localhost:3600/api/leads 查看潜客');
}

main()
  .catch((e) => {
    console.error('❌ 种子数据创建失败:');
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
