import { NextRequest, NextResponse } from 'next/server';
import { cookies } from 'next/headers';

// 仅在开发环境中可用的登录API
export async function POST(req: NextRequest) {
  // 检查是否为开发环境
  if (process.env.NODE_ENV !== 'development') {
    return NextResponse.json(
      { error: '此API仅在开发环境中可用' },
      { status: 403 }
    );
  }

  try {
    // 解析请求体
    const body = await req.json();
    
    // 设置一个简单的会话cookie
    cookies().set({
      name: 'dev-session',
      value: 'dev-user-' + Date.now(),
      httpOnly: true,
      path: '/',
      maxAge: 60 * 60 * 24, // 1天
      sameSite: 'lax',
    });

    // 返回成功响应
    return NextResponse.json({
      success: true,
      message: '开发环境登录成功',
      timestamp: new Date().toISOString(),
    });
    
  } catch (error) {
    console.error('开发登录API错误:', error);
    
    return NextResponse.json(
      { error: '处理请求时出错' },
      { status: 500 }
    );
  }
}