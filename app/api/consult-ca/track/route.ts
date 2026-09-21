import { NextRequest, NextResponse } from 'next/server';
import { getCAQueries, findCAQueryById } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id')?.trim();
    const phone = searchParams.get('phone')?.trim();

    if (!id && !phone) {
      return NextResponse.json(
        { error: 'Query Ticket ID or Registered Phone Number is required.' },
        { status: 400 }
      );
    }

    const allQueries = getCAQueries();

    if (id) {
      const match = findCAQueryById(id);
      if (!match) {
        return NextResponse.json(
          { error: `No consultation query found with Reference "${id}".` },
          { status: 404 }
        );
      }
      return NextResponse.json({ success: true, query: match });
    }

    if (phone) {
      const cleanPhone = phone.replace(/[^0-9]/g, '').slice(-10);
      const matches = allQueries.filter(q => q.clientPhone.replace(/[^0-9]/g, '').endsWith(cleanPhone));
      return NextResponse.json({ success: true, queries: matches });
    }

    return NextResponse.json({ error: 'Query not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Server error' }, { status: 500 });
  }
}
