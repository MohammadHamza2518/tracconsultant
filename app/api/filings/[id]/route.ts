import { NextRequest, NextResponse } from 'next/server';
import { getFilingById, updateFiling, deleteFiling } from '@/lib/db';

export async function GET(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const filing = getFilingById(id);

    if (!filing) {
      return NextResponse.json({ success: false, error: 'Filing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: filing });
  } catch (error) {
    console.error('API /api/filings/[id] GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch filing' }, { status: 500 });
  }
}

export async function PATCH(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const updates = await req.json();

    const updated = updateFiling(id, updates);

    if (!updated) {
      return NextResponse.json({ success: false, error: 'Filing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, data: updated });
  } catch (error) {
    console.error('API /api/filings/[id] PATCH error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update filing' }, { status: 500 });
  }
}

export async function DELETE(
  req: NextRequest,
  context: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await context.params;
    const deleted = deleteFiling(id);

    if (!deleted) {
      return NextResponse.json({ success: false, error: 'Filing not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Filing deleted successfully' });
  } catch (error) {
    console.error('API /api/filings/[id] DELETE error:', error);
    return NextResponse.json({ success: false, error: 'Failed to delete filing' }, { status: 500 });
  }
}
