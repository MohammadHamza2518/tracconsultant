import { NextRequest, NextResponse } from 'next/server';
import { getSavedGstInvoices, upsertSavedGstInvoice, deleteSavedGstInvoice, SavedGstInvoice } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const search = searchParams.get('search');
    const userId = searchParams.get('userId');

    let invoices = getSavedGstInvoices();

    if (userId) {
      invoices = invoices.filter(i => !i.userId || i.userId === userId);
    }

    if (search) {
      const q = search.toLowerCase();
      invoices = invoices.filter(i => 
        (i.number && i.number.toLowerCase().includes(q)) ||
        (i.buyer && i.buyer.toLowerCase().includes(q)) ||
        (i.date && i.date.includes(q))
      );
    }

    return NextResponse.json({
      success: true,
      count: invoices.length,
      invoices
    });
  } catch (error: any) {
    console.error('API /api/tools/gst-invoices GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch invoices' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { number, date, buyer, grandTotal, formState, userId } = body;

    if (!number) {
      return NextResponse.json({ error: 'Invoice number is required.' }, { status: 400 });
    }

    const savedInvoice: SavedGstInvoice = {
      id: body.id || `inv-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
      savedAt: new Date().toISOString(),
      number: String(number).trim(),
      date: date || new Date().toISOString().slice(0, 10),
      buyer: buyer || 'Cash / Unregistered Buyer',
      grandTotal: Number(grandTotal) || 0,
      formState: formState || {},
      userId: userId || undefined
    };

    const result = upsertSavedGstInvoice(savedInvoice);

    return NextResponse.json({
      success: true,
      message: 'Invoice successfully saved to permanent history!',
      invoice: result
    }, { status: 201 });
  } catch (error: any) {
    console.error('API /api/tools/gst-invoices POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to save invoice' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    let number = searchParams.get('number');

    if (!number) {
      try {
        const body = await req.json();
        number = body.number;
      } catch {}
    }

    if (!number) {
      return NextResponse.json({ error: 'Invoice number is required for deletion.' }, { status: 400 });
    }

    const ok = deleteSavedGstInvoice(number);
    return NextResponse.json({
      success: true,
      deleted: ok,
      message: ok ? 'Invoice deleted from history.' : 'Invoice not found.'
    });
  } catch (error: any) {
    console.error('API /api/tools/gst-invoices DELETE error:', error);
    return NextResponse.json({ error: error.message || 'Failed to delete invoice' }, { status: 500 });
  }
}
