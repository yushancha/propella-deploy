#!/usr/bin/env node

/**
 * 开发环境启动脚本 - 自动配置代理
 */

const { spawn } = require('child_process');
const path = require('path');

// 设置代理环境变量
process.env.HTTP_PROXY = 'http://127.0.0.1:33210';
process.env.HTTPS_PROXY = 'http://127.0.0.1:33210';
process.env.NO_PROXY = 'localhost,127.0.0.1';

console.log('🚀 启动开发服务器（已配置代理）...');
console.log('📡 HTTP代理:', process.env.HTTP_PROXY);
console.log('📡 HTTPS代理:', process.env.HTTPS_PROXY);

// 检测可用的包管理器
function detectPackageManager() {
  const managers = ['npm', 'yarn', 'pnpm'];
  
  for (const manager of managers) {
    try {
      const result = spawn.sync(manager, ['--version'], { stdio: 'ignore' });
      if (result.status === 0) {
        return manager;
      }
    } catch (error) {
      // 继续尝试下一个
    }
  }
  
  return 'npm'; // 默认使用 npm
}

const packageManager = detectPackageManager();
console.log('📦 使用包管理器:', packageManager);

// 启动Next.js开发服务器
const nextDev = spawn(packageManager, ['run', 'dev'], {
  stdio: 'inherit',
  env: process.env,
  cwd: process.cwd(),
  shell: true // 在 Windows 上需要 shell: true
});

nextDev.on('close', (code) => {
  console.log(`开发服务器退出，代码: ${code}`);
});

nextDev.on('error', (err) => {
  console.error('启动失败:', err);
});
