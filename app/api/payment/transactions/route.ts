import { NextRequest, NextResponse } from 'next/server';
import { getPayments } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const orderId = searchParams.get('orderId');
    const email = searchParams.get('email');

    let payments = getPayments();

    if (orderId) {
      payments = payments.filter(p => p.razorpayOrderId === orderId || p.id === orderId);
    }
    if (email) {
      payments = payments.filter(p => p.payerEmail?.toLowerCase() === email.toLowerCase());
    }

    return NextResponse.json({
      success: true,
      count: payments.length,
      payments
    });
  } catch (error: any) {
    console.error('API /api/payment/transactions error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to fetch transactions' },
      { status: 500 }
    );
  }
}
