import { NextResponse } from 'next/server';
import { getSystemConfig } from '@/lib/config';

// Revalidate or ensure dynamic fetching
export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getSystemConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message || 'Failed to fetch config' },
      { status: 500 }
    );
  }
}
