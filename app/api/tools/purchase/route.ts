import { NextRequest, NextResponse } from 'next/server';
import { recordToolPurchase, findUserById, createUser, findUserByEmail } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, userEmail, userName, userPhone, toolId, toolName, amount, paymentMode, paymentId } = body;

    if (!toolId || !toolName || !amount) {
      return NextResponse.json({ error: 'Tool details and amount are required.' }, { status: 400 });
    }

    let targetUserId = userId;
    let targetName = userName || 'Client';

    // If no userId provided, find or create by email
    if (!targetUserId && userEmail) {
      let user = findUserByEmail(userEmail);
      if (!user) {
        user = createUser({
          name: targetName,
          email: userEmail,
          phone: userPhone || '',
          role: 'client'
        });
      }
      targetUserId = user.id;
    }

    if (!targetUserId) {
      return NextResponse.json({ error: 'User identification (userId or userEmail) is required.' }, { status: 400 });
    }

    const purchase = recordToolPurchase({
      userId: targetUserId,
      userName: targetName,
      userEmail: userEmail || '',
      userPhone: userPhone || '',
      toolId,
      toolName,
      amount: Number(amount),
      paymentMode: paymentMode || 'UPI',
      paymentId: paymentId || `pay_${Date.now()}`
    });

    const updatedUser = findUserById(targetUserId);
    const { password: _, ...userSafe } = (updatedUser || {}) as any;

    return NextResponse.json({
      success: true,
      message: `${toolName} has been unlocked successfully!`,
      purchase,
      user: userSafe
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
