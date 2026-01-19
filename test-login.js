/**
 * 管理员登录功能测试脚本
 * 测试登录API和认证流程
 */

const baseUrl = 'http://localhost:3600';

// 测试用例
const testCases = [
  {
    name: '✅ 正确的用户名和密码',
    username: 'admin',
    password: 'admin123',
    shouldPass: true,
  },
  {
    name: '❌ 错误的密码',
    username: 'admin',
    password: 'wrongpassword',
    shouldPass: false,
  },
  {
    name: '❌ 不存在的用户名',
    username: 'nonexistent',
    password: 'admin123',
    shouldPass: false,
  },
  {
    name: '❌ 空用户名',
    username: '',
    password: 'admin123',
    shouldPass: false,
  },
  {
    name: '❌ 空密码',
    username: 'admin',
    password: '',
    shouldPass: false,
  },
];

// 测试登录功能
async function testLogin(testCase) {
  console.log(`\n🧪 测试: ${testCase.name}`);
  console.log(`   用户名: "${testCase.username}"`);
  console.log(`   密码: "${testCase.password}"`);

  try {
    // 步骤1: 获取CSRF Token
    const csrfResponse = await fetch(`${baseUrl}/api/auth/csrf`);
    const csrfData = await csrfResponse.json();
    const csrfToken = csrfData.csrfToken;

    if (!csrfToken) {
      console.log('   ⚠️  无法获取CSRF Token');
      return false;
    }

    // 步骤2: 发送登录请求
    const loginResponse = await fetch(
      `${baseUrl}/api/auth/callback/credentials`,
      {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded',
        },
        body: new URLSearchParams({
          username: testCase.username,
          password: testCase.password,
          csrfToken: csrfToken,
          callbackUrl: `${baseUrl}/admin`,
          json: 'true',
        }),
        redirect: 'manual',
      }
    );

    const responseText = await loginResponse.text();
    let result;
    try {
      result = JSON.parse(responseText);
    } catch {
      // 如果不是JSON,检查重定向
      const location = loginResponse.headers.get('location');
      result = { url: location };
    }

    // 判断登录是否成功
    const isSuccess = result.url && !result.url.includes('error');
    const actualResult = isSuccess ? '成功' : '失败';
    const expectedResult = testCase.shouldPass ? '成功' : '失败';

    if (isSuccess === testCase.shouldPass) {
      console.log(`   ✅ 测试通过 - 登录${actualResult}(符合预期)`);
      if (result.url) {
        console.log(`   📍 重定向到: ${result.url}`);
      }
      return true;
    } else {
      console.log(
        `   ❌ 测试失败 - 预期${expectedResult},实际${actualResult}`
      );
      if (result.url) {
        console.log(`   📍 重定向到: ${result.url}`);
      }
      return false;
    }
  } catch (error) {
    console.log(`   ❌ 测试出错: ${error.message}`);
    return false;
  }
}

// 主测试流程
async function runTests() {
  console.log('='.repeat(60));
  console.log('🚀 开始测试管理员登录功能');
  console.log('='.repeat(60));

  // 检查服务器是否运行
  console.log(`\n📡 检查服务器状态 (${baseUrl})...`);
  try {
    const healthCheck = await fetch(baseUrl);
    console.log(`✅ 服务器正在运行 (状态码: ${healthCheck.status})`);
  } catch (error) {
    console.log(`❌ 无法连接到服务器: ${error.message}`);
    console.log('   请确保运行: npm run dev');
    process.exit(1);
  }

  // 检查数据库连接
  console.log('\n📊 检查数据库连接...');
  try {
    const apiCheck = await fetch(`${baseUrl}/api/cases`);
    if (apiCheck.ok) {
      console.log('✅ 数据库连接正常');
    } else {
      console.log(
        `⚠️  API返回状态码 ${apiCheck.status} - 数据库可能未初始化`
      );
    }
  } catch (error) {
    console.log(`⚠️  数据库检查失败: ${error.message}`);
  }

  // 运行所有测试用例
  console.log('\n' + '='.repeat(60));
  console.log('📋 执行测试用例');
  console.log('='.repeat(60));

  let passedCount = 0;
  let failedCount = 0;

  for (const testCase of testCases) {
    const passed = await testLogin(testCase);
    if (passed) {
      passedCount++;
    } else {
      failedCount++;
    }
    // 延迟避免请求过快
    await new Promise((resolve) => setTimeout(resolve, 500));
  }

  // 测试结果汇总
  console.log('\n' + '='.repeat(60));
  console.log('📊 测试结果汇总');
  console.log('='.repeat(60));
  console.log(`总计: ${testCases.length} 个测试`);
  console.log(`✅ 通过: ${passedCount} 个`);
  console.log(`❌ 失败: ${failedCount} 个`);
  console.log(
    `成功率: ${((passedCount / testCases.length) * 100).toFixed(1)}%`
  );
  console.log('='.repeat(60));

  // 返回测试结果
  process.exit(failedCount > 0 ? 1 : 0);
}

// 执行测试
runTests();
