import { NextRequest, NextResponse } from 'next/server';
import { findCAQueryById, updateCAQuery, getCAQueries, saveCAQueriesList } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const query = findCAQueryById(id);
    if (!query) {
      return NextResponse.json({ error: 'Query not found' }, { status: 404 });
    }
    return NextResponse.json({ success: true, query });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const body = await req.json();
    const { status, caResponse, assignedCA, paymentStatus } = body;

    const existing = findCAQueryById(id);
    if (!existing) {
      return NextResponse.json({ error: 'Query not found' }, { status: 404 });
    }

    const updates: any = {};
    if (status) updates.status = status;
    if (paymentStatus) updates.paymentStatus = paymentStatus;
    if (assignedCA) updates.assignedCA = assignedCA;
    if (caResponse) {
      updates.caResponse = {
        ...caResponse,
        respondedAt: new Date().toISOString()
      };
      // If a solution is provided, mark status as resolved unless explicitly passed
      if (!status) {
        updates.status = 'resolved';
      }
    }

    const updated = updateCAQuery(id, updates);
    return NextResponse.json({ success: true, query: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const list = getCAQueries();
    const filtered = list.filter(q => q.id.toLowerCase() !== id.toLowerCase());
    saveCAQueriesList(filtered);
    return NextResponse.json({ success: true, message: 'Query deleted' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
