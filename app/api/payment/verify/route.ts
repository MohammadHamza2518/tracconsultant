import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { updatePaymentStatus, findPaymentByOrderId, recordToolPurchase, findUserByEmail, createUser } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { 
      razorpay_order_id, 
      razorpay_payment_id, 
      razorpay_signature,
      receiptId,
      planName,
      amount,
      customer,
      notes
    } = body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return NextResponse.json(
        { error: 'Missing Razorpay verification parameters.' },
        { status: 400 }
      );
    }

    // 1. Verify HMAC SHA-256 signature
    const isValid = verifyRazorpaySignature({
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature
    });

    if (!isValid) {
      updatePaymentStatus(razorpay_order_id, { status: 'failed' });
      return NextResponse.json(
        { success: false, error: 'Payment signature verification failed. Untrusted response.' },
        { status: 400 }
      );
    }

    // 2. Mark payment as Paid in database
    const updated = updatePaymentStatus(razorpay_order_id, {
      status: 'paid',
      razorpayPaymentId: razorpay_payment_id,
      razorpaySignature: razorpay_signature,
      verifiedAt: new Date().toISOString()
    });

    // 3. If this payment is for unlocking a SaaS tool, record the tool purchase
    if (notes?.type === 'tool' || notes?.toolId) {
      const toolId = notes.toolId;
      const toolName = notes.toolName || planName || toolId;
      const userEmail = customer?.email || '';
      const userName = customer?.name || 'Verified Taxpayer';
      const userPhone = customer?.phone || '';
      let targetUserId = notes.userId;

      if (!targetUserId && userEmail) {
        let user = findUserByEmail(userEmail);
        if (!user) {
          user = createUser({
            name: userName,
            email: userEmail,
            phone: userPhone,
            role: 'client'
          });
        }
        targetUserId = user.id;
      }

      if (targetUserId) {
        recordToolPurchase({
          userId: targetUserId,
          userName,
          userEmail,
          userPhone,
          toolId,
          toolName,
          amount: Number(amount) || 0,
          paymentMode: 'Card', // Razorpay online
          paymentId: razorpay_payment_id
        });
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      receiptId: updated?.id || receiptId || `TRAC-PAY-${new Date().getFullYear()}`,
      paymentId: razorpay_payment_id,
      message: 'Payment verified and officially confirmed.'
    });
  } catch (error: any) {
    console.error('API /api/payment/verify error:', error);
    return NextResponse.json(
      { error: error.message || 'Payment verification failed.' },
      { status: 500 }
    );
  }
}
