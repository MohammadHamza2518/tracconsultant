import crypto from 'crypto';

export const RAZORPAY_KEY_ID = 
  process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID || 
  process.env.RAZORPAY_KEY_ID || 
  'rzp_test_Tdyj5KRoPhN4Ao';

export const RAZORPAY_KEY_SECRET = 
  process.env.RAZORPAY_KEY_SECRET || 
  'pSGKjdOMdizDHuy99nj9q3b7';

export interface CreateOrderParams {
  amount: number; // in INR
  currency?: string;
  receipt?: string;
  notes?: Record<string, string>;
}

export interface RazorpayOrderResponse {
  id: string;
  entity: string;
  amount: number;
  amount_paid: number;
  amount_due: number;
  currency: string;
  receipt: string;
  status: string;
  attempts: number;
  notes: Record<string, any>;
  created_at: number;
}

/**
 * Creates a real server-side order with Razorpay
 */
export async function createRazorpayOrder(params: CreateOrderParams): Promise<RazorpayOrderResponse> {
  const auth = Buffer.from(`${RAZORPAY_KEY_ID}:${RAZORPAY_KEY_SECRET}`).toString('base64');
  const amountInPaise = Math.round(params.amount * 100);

  const res = await fetch('https://api.razorpay.com/v1/orders', {
    method: 'POST',
    headers: {
      'Authorization': `Basic ${auth}`,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      amount: amountInPaise,
      currency: params.currency || 'INR',
      receipt: params.receipt || `rec_${Date.now().toString().slice(-8)}`,
      notes: params.notes || {}
    })
  });

  const data = await res.json();
  if (!res.ok) {
    const errorMsg = data.error?.description || data.message || 'Razorpay order creation failed';
    throw new Error(errorMsg);
  }

  return data as RazorpayOrderResponse;
}

export interface VerifySignatureParams {
  orderId: string;
  paymentId: string;
  signature: string;
}

/**
 * Verifies Razorpay HMAC SHA-256 signature
 */
export function verifyRazorpaySignature({ orderId, paymentId, signature }: VerifySignatureParams): boolean {
  if (!orderId || !paymentId || !signature) return false;
  try {
    const body = `${orderId}|${paymentId}`;
    const expectedSignature = crypto
      .createHmac('sha256', RAZORPAY_KEY_SECRET)
      .update(body)
      .digest('hex');
    return expectedSignature === signature;
  } catch (err) {
    console.error('Signature verification error:', err);
    return false;
  }
}
