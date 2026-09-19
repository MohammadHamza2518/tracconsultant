import { NextRequest, NextResponse } from 'next/server';
import { getFilings, createFiling } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const service = searchParams.get('service');
    const status = searchParams.get('status');
    const search = searchParams.get('search');

    let filings = getFilings();

    if (service && service !== 'all') {
      filings = filings.filter(f => f.service.toLowerCase() === service.toLowerCase());
    }

    if (status && status !== 'all') {
      filings = filings.filter(f => f.status.toLowerCase() === status.toLowerCase());
    }

    if (search) {
      const q = search.toLowerCase();
      filings = filings.filter(f =>
        f.id.toLowerCase().includes(q) ||
        f.fullName.toLowerCase().includes(q) ||
        f.mobile.includes(q) ||
        f.email.toLowerCase().includes(q) ||
        (f.panNumber && f.panNumber.toLowerCase().includes(q))
      );
    }

    return NextResponse.json({ success: true, count: filings.length, data: filings });
  } catch (error) {
    console.error('API /api/filings error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch filings' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (!body.fullName || !body.mobile || !body.service) {
      return NextResponse.json(
        { success: false, error: 'Full name, mobile number, and service are required.' },
        { status: 400 }
      );
    }

    const newFiling = createFiling(body);

    return NextResponse.json({
      success: true,
      message: 'Filing created successfully',
      data: newFiling
    }, { status: 201 });
  } catch (error) {
    console.error('API /api/filings POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to create filing' }, { status: 500 });
  }
}
