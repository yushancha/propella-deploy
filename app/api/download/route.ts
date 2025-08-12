export const dynamic = 'force-dynamic';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const imageUrl = searchParams.get('url');
    
    if (!imageUrl) {
      return NextResponse.json({ error: '缺少图片URL' }, { status: 400 });
    }

    // 获取图片
    const response = await fetch(imageUrl);
    if (!response.ok) {
      throw new Error('获取图片失败');
    }

    const imageBuffer = await response.arrayBuffer();
    
    // 返回图片数据
    return new NextResponse(imageBuffer, {
      headers: {
        'Content-Type': response.headers.get('Content-Type') || 'image/png',
        'Content-Disposition': 'attachment; filename="generated-item.png"',
      },
    });
  } catch (error) {
    console.error('下载图片失败:', error);
    return NextResponse.json({ error: '下载失败' }, { status: 500 });
  }
}
