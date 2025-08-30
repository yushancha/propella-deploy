import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';

export const dynamic = 'force-dynamic';

// Disabled History API as feature removed
export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    return NextResponse.json({ history: [] });
  } catch (error) {
    console.error('History API error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const session = await getServerSession();
    
    if (!session) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const { id } = await request.json();
    
    // 这里可以添加删除历史记录的逻辑
    
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Delete history error:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}