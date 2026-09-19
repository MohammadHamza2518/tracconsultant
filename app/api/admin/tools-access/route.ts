import { NextRequest, NextResponse } from 'next/server';
import { getToolPurchases, togglePurchaseStatus, toggleUserToolAccess, recordToolPurchase, findUserById } from '@/lib/db';

export async function GET() {
  try {
    const purchases = getToolPurchases();
    return NextResponse.json({ purchases });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

// Admin manually toggle or grant access
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, purchaseId, userId, toolId, toolName, userEmail, userName } = body;

    if (action === 'toggle_purchase') {
      if (!purchaseId) {
        return NextResponse.json({ error: 'Purchase ID required' }, { status: 400 });
      }
      const updated = togglePurchaseStatus(purchaseId);
      if (!updated) {
        return NextResponse.json({ error: 'Purchase record not found' }, { status: 404 });
      }
      return NextResponse.json({ success: true, purchase: updated });
    }

    if (action === 'manual_grant') {
      if (!userId || !toolId) {
        return NextResponse.json({ error: 'userId and toolId required' }, { status: 400 });
      }

      const user = findUserById(userId);
      const grantSuccess = toggleUserToolAccess(userId, toolId, true);

      // Record in purchase logs as Admin_Grant
      const purchase = recordToolPurchase({
        userId,
        userName: userName || user?.name || 'Client',
        userEmail: userEmail || user?.email || '',
        toolId,
        toolName: toolName || toolId,
        amount: 0,
        paymentMode: 'Admin_Grant',
        paymentId: `admin_grant_${Date.now()}`
      });

      return NextResponse.json({ success: true, message: 'Tool access granted by admin', purchase });
    }

    if (action === 'manual_revoke') {
      if (!userId || !toolId) {
        return NextResponse.json({ error: 'userId and toolId required' }, { status: 400 });
      }
      toggleUserToolAccess(userId, toolId, false);
      return NextResponse.json({ success: true, message: 'Tool access revoked by admin' });
    }

    return NextResponse.json({ error: 'Invalid action' }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
