import { NextRequest, NextResponse } from 'next/server';
import { verifyRazorpaySignature } from '@/lib/razorpay';
import { updatePaymentStatus, findPaymentByOrderId, recordToolPurchase, findUserByEmail, findUserById, createUser, syncUserPurchasedTools, createFiling } from '@/lib/db';

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

    let confirmedUser: any = null;
    let confirmedFiling: any = null;

    const userEmail = customer?.email?.trim().toLowerCase() || '';
    const userName = customer?.name?.trim() || 'Verified Taxpayer';
    const userPhone = customer?.phone?.trim() || '';
    let targetUserId = notes?.userId;

    // Resolve or auto-register user account
    let user = null;
    if (targetUserId && targetUserId !== 'usr-client') {
      user = findUserById(targetUserId);
    }
    if (!user && userEmail) {
      user = findUserByEmail(userEmail);
      if (!user) {
        user = createUser({
          name: userName,
          email: userEmail,
          phone: userPhone,
          role: 'client',
          password: 'default123'
        });
      }
    }

    // 3. If this payment is for unlocking a SaaS tool, record the tool purchase
    if (notes?.type === 'tool' || notes?.toolId) {
      const toolId = notes.toolId;
      const toolName = notes.toolName || planName || toolId;

      if (user) {
        recordToolPurchase({
          userId: user.id,
          userName: user.name || userName,
          userEmail: user.email || userEmail,
          userPhone: user.phone || userPhone,
          toolId,
          toolName,
          amount: Number(amount) || 0,
          paymentMode: 'Card', // Razorpay online
          paymentId: razorpay_payment_id
        });

        // Link payment to userId
        updatePaymentStatus(razorpay_order_id, {
          notes: { ...(updated?.notes || {}), userId: user.id }
        });

        const synced = syncUserPurchasedTools(user);
        const { password: _, ...userSafe } = synced as any;
        confirmedUser = userSafe;
      }
    } else {
      // 4. If this payment is for a SERVICE, record the service filing
      if (user) {
        confirmedFiling = createFiling({
          userId: user.id,
          service: notes?.service || planName || 'Tax & Compliance Advisory',
          plan: planName || 'Standard Assisted Filing',
          fullName: userName,
          email: userEmail || user.email,
          mobile: userPhone || user.phone,
          panNumber: customer?.panNumber || undefined,
          financialYear: 'FY 2024-25 (AY 2025-26)',
          clientNotes: `Paid Online via Razorpay (Payment ID: ${razorpay_payment_id}, Receipt: ${updated?.id || receiptId}). Amount: ₹${amount}.`
        });

        // Link payment to userId and filingId
        updatePaymentStatus(razorpay_order_id, {
          notes: { ...(updated?.notes || {}), userId: user.id, filingId: confirmedFiling.id }
        });

        const synced = syncUserPurchasedTools(user);
        const { password: _, ...userSafe } = synced as any;
        confirmedUser = userSafe;
      }
    }

    return NextResponse.json({
      success: true,
      verified: true,
      receiptId: updated?.id || receiptId || `TRAC-PAY-${new Date().getFullYear()}`,
      paymentId: razorpay_payment_id,
      user: confirmedUser,
      filing: confirmedFiling,
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
