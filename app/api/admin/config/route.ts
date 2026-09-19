import { NextRequest, NextResponse } from 'next/server';
import { getSystemConfig, saveSystemConfig, resetSystemConfig } from '@/lib/config';

export const dynamic = 'force-dynamic';

export async function GET() {
  try {
    const config = getSystemConfig();
    return NextResponse.json({ success: true, config });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'reset') {
      const reset = resetSystemConfig();
      return NextResponse.json({
        success: true,
        message: 'System rates & pricing reset to default Budget FY 2024-25 settings.',
        config: reset
      });
    }

    const updated = saveSystemConfig(body.config, body.updatedBy || 'Lead CA Partner');
    return NextResponse.json({
      success: true,
      message: 'Rates & pricing successfully updated and applied across the platform!',
      config: updated
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
