import { NextRequest, NextResponse } from 'next/server';
import { getUserPortalData, createFiling, createLead, updateUser, findUserById, findUserByEmail } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId');
    const email = searchParams.get('email');

    const identifier = userId || email;
    if (!identifier) {
      return NextResponse.json({ error: 'User ID or Email is required.' }, { status: 400 });
    }

    const portalData = getUserPortalData(identifier);
    if (!portalData) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      ...portalData
    });
  } catch (error: any) {
    console.error('API /api/user/portal GET error:', error);
    return NextResponse.json({ error: error.message || 'Failed to fetch portal data' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { action, userId, email } = body;

    const identifier = userId || email;
    if (!identifier) {
      return NextResponse.json({ error: 'User ID or Email is required.' }, { status: 400 });
    }

    let user = findUserById(identifier) || findUserByEmail(identifier);
    if (!user) {
      return NextResponse.json({ error: 'User account not found.' }, { status: 404 });
    }

    // Action 1: Direct Service Booking from Client Portal
    if (action === 'book_service') {
      const { service, plan, clientPhone, entityType, preferredSlot, notes } = body;
      
      if (!service) {
        return NextResponse.json({ error: 'Service name is required.' }, { status: 400 });
      }

      // 1. Create real permanent filing in filings.json
      const newFiling = createFiling({
        userId: user.id,
        fullName: user.name,
        email: user.email,
        mobile: clientPhone || user.phone || '9876543210',
        service: service,
        plan: plan || `${service} [${entityType || 'Standard'}]`,
        financialYear: 'FY 2024-25 (AY 2025-26)',
        clientNotes: `Slot: ${preferredSlot || 'Flexible'}. ${notes || ''}`.trim()
      });

      // 2. Also register in Leads CRM for CA Partner assignment
      createLead({
        fullName: user.name,
        mobile: clientPhone || user.phone || '9876543210',
        email: user.email,
        serviceInterest: `${service} (${entityType || 'General'})`,
        message: `Client Portal Booking [Ref: ${newFiling.id}]. Slot: ${preferredSlot || 'Any'}. Notes: ${notes || 'None'}`,
        source: 'Client Portal Dashboard'
      });

      // Fetch fresh synced portal data
      const updatedData = getUserPortalData(user.id);
      return NextResponse.json({
        success: true,
        message: `Service booked successfully! Assigned Ref ID: ${newFiling.id}`,
        filing: newFiling,
        ...updatedData
      }, { status: 201 });
    }

    // Action 2: Update Profile (phone, pan, avatar / DP, etc.)
    if (action === 'update_profile') {
      const { name, phone, avatar } = body;
      const updatedUser = updateUser(user.id, {
        ...(name ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(avatar !== undefined ? { avatar: avatar || '' } : {})
      });

      const updatedData = getUserPortalData(user.id);
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully!',
        user: updatedUser,
        ...updatedData
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('API /api/user/portal POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process portal action' }, { status: 500 });
  }
}
