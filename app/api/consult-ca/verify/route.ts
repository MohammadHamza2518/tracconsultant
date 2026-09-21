import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { updatePaymentStatus, findCAQueryByOrderId, updateCAQuery, findCAQueryById } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      queryId
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing Razorpay signature parameters.' },
        { status: 400 }
      );
    }

    // 1. Verify Razorpay HMAC signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValid) {
      updatePaymentStatus(razorpay_order_id, { status: 'failed' });
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed.' },
        { status: 400 }
      );
    }

    // 2. Update payment transaction
    updatePaymentStatus(razorpay_order_id, {
      status: 'paid',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      verifiedAt: new Date().toISOString()
    });

    // 3. Find and activate CA query ticket
    let query = queryId ? findCAQueryById(queryId) : findCAQueryByOrderId(razorpay_order_id);

    if (query) {
      query = updateCAQuery(query.id, {
        paymentStatus: 'paid',
        paymentId: razorpay_payment_id,
        status: 'in_review'
      }) || query;
    }

    // Prepare WhatsApp acknowledgment message
    const clientName = query?.clientName || 'Taxpayer';
    const ticketId = query?.id || 'TRAC-QRY-CONFIRMED';
    const rawPhone = (query?.clientPhone || '').replace(/[^0-9]/g, '');
    const cleanPhone = rawPhone.length === 10 ? '91' + rawPhone : rawPhone;

    const message = `Hello ${clientName}! 🏛️\n\nYour Consultation & Legal Advisory Query has been *Verified & Assigned* to our Senior Chartered Accountant.\n\n📌 *Query Ticket Ref:* ${ticketId}\n💰 *Amount Paid:* ₹${query?.amount || 299}\n⏱️ *Guaranteed Resolution:* 24–48 Hours\n\nOur CA is reviewing your facts and documents. You will receive your complete legal opinion right here on WhatsApp and in your email.\n\n*Tracconsultant Advisory Desk: +91 7275922162*`;
    const whatsappUrl = `https://wa.me/917275922162?text=${encodeURIComponent(`Hello Tracconsultant CA Desk! I just submitted my query (Ref: ${ticketId}). Here is my inquiry.`)}`;

    return NextResponse.json({
      success: true,
      queryId: query?.id,
      paymentId: razorpay_payment_id,
      status: 'in_review',
      clientName,
      whatsappUrl,
      message: 'Consultation query activated and assigned to Senior Chartered Accountant.'
    });
  } catch (error: any) {
    console.error('Error in /api/consult-ca/verify:', error);
    return NextResponse.json(
      { error: error.message || 'Failed to verify consultation payment.' },
      { status: 500 }
    );
  }
}
