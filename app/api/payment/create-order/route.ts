import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder, RAZORPAY_KEY_ID } from '@/lib/razorpay';
import { recordPayment } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { amount, planName, service, customer, notes } = body;

    const numAmount = Number(amount);
    if (!numAmount || numAmount < 1) {
      return NextResponse.json(
        { error: 'Valid payment amount is required (minimum ₹1).' },
        { status: 400 }
      );
    }

    const cleanPlanName = String(planName || 'CA Advisory Service').slice(0, 40);
    const orderNotes: Record<string, string> = {
      plan: cleanPlanName,
      customerName: String(customer?.name || '').slice(0, 40),
      customerPhone: String(customer?.phone || '').slice(0, 20),
      ...(notes || {})
    };

    // 1. Create order on Razorpay
    const order = await createRazorpayOrder({
      amount: numAmount,
      currency: 'INR',
      notes: orderNotes
    });

    // 2. Pre-record transaction in local data store
    const localPayment = recordPayment({
      razorpayOrderId: order.id,
      amount: numAmount,
      currency: 'INR',
      planName: planName || 'CA Advisory Service',
      service: service || 'Advisory',
      payerName: customer?.name || 'Taxpayer',
      payerEmail: customer?.email || '',
      payerPhone: customer?.phone || '',
      panNumber: customer?.panNumber || '',
      status: 'created',
      notes: orderNotes
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      amount: order.amount, // in paise
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      receiptId: localPayment.id
    });
  } catch (error: any) {
    console.error('API /api/payment/create-order error:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize payment gateway order.' },
      { status: 500 }
    );
  }
}
