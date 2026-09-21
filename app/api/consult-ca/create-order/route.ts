import { NextRequest, NextResponse } from 'next/server';
import { createRazorpayOrder, RAZORPAY_KEY_ID } from '@/lib/razorpay';
import { createCAQuery, recordPayment } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      clientName, 
      clientEmail, 
      clientPhone, 
      category, 
      plan, 
      querySubject, 
      queryDetails, 
      documents,
      userId 
    } = body;

    if (!clientName?.trim() || !clientEmail?.trim() || !clientPhone?.trim() || !queryDetails?.trim()) {
      return NextResponse.json(
        { error: 'Name, email, phone number, and query details are required.' },
        { status: 400 }
      );
    }

    const isPriority = plan === 'priority';
    const amount = isPriority ? 599 : 299;
    const planTitle = isPriority ? 'Priority Notice & Legal Advisory Desk' : 'Standard Written CA Legal Opinion';

    const cleanName = String(clientName).trim().slice(0, 40);
    const cleanPhone = String(clientPhone).trim().slice(0, 20);

    // 1. Create Razorpay order
    const order = await createRazorpayOrder({
      amount,
      currency: 'INR',
      notes: {
        type: 'ca_consultation',
        plan: isPriority ? 'priority' : 'standard',
        clientName: cleanName,
        clientPhone: cleanPhone,
        category: String(category || 'Tax Advisory').slice(0, 40)
      }
    });

    // 2. Pre-create CA Query draft in local store
    const query = createCAQuery({
      userId: userId || '',
      clientName: cleanName,
      clientEmail: clientEmail.trim().toLowerCase(),
      clientPhone: cleanPhone,
      category: category || 'Income Tax & Legal Advisory',
      plan: isPriority ? 'priority' : 'standard',
      amount,
      orderId: order.id,
      paymentStatus: 'pending',
      querySubject: querySubject?.trim() || 'Chartered Accountant Legal Inquiry',
      queryDetails: queryDetails.trim(),
      documents: Array.isArray(documents) ? documents : [],
      status: 'pending'
    });

    // 3. Pre-record transaction
    recordPayment({
      razorpayOrderId: order.id,
      amount,
      currency: 'INR',
      planName: planTitle,
      service: 'CA Consultation',
      payerName: cleanName,
      payerEmail: clientEmail.trim().toLowerCase(),
      payerPhone: cleanPhone,
      status: 'created',
      notes: { queryId: query.id, plan }
    });

    return NextResponse.json({
      success: true,
      orderId: order.id,
      queryId: query.id,
      amount: order.amount,
      currency: order.currency,
      keyId: RAZORPAY_KEY_ID,
      planTitle
    });
  } catch (error: any) {
    console.error('Error in /api/consult-ca/create-order:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to initialize consultation order.' },
      { status: 500 }
    );
  }
}
