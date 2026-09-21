import { NextRequest, NextResponse } from 'next/server';
import { getCAQueries, createCAQuery } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const list = getCAQueries();
    return NextResponse.json({ success: true, queries: list });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to fetch queries' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = createCAQuery({
      ...body,
      paymentStatus: body.paymentStatus || 'paid',
      status: body.status || 'in_review'
    });
    return NextResponse.json({ success: true, query: created });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create query' }, { status: 500 });
  }
}
