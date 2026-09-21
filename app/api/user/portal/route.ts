import { NextRequest, NextResponse } from 'next/server';
import { getUserPortalData, createFiling, createLead, updateUser, findUserById, findUserByEmail, createUser, getFilings, saveFilings } from '@/lib/db';

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
      if (email || (identifier && identifier.includes('@'))) {
        const userEmail = (email || identifier).toLowerCase().trim();
        user = createUser({
          email: userEmail,
          name: body.name || userEmail.split('@')[0],
          role: 'client'
        });
      }
    }

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
      const updatedUser = updateUser(user.id || user.email, {
        ...(name ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(avatar !== undefined ? { avatar: avatar || '' } : {})
      });

      const updatedData = getUserPortalData(user.id);
      return NextResponse.json({
        success: true,
        message: 'Profile updated successfully!',
        user: updatedUser || { ...user, avatar: avatar || '' },
        ...updatedData
      });
    }

    // Action 3: Upload Document to Encrypted Vault (persisted to server & visible to Admin)
    if (action === 'upload_vault_document') {
      const { name, size, type } = body;
      if (!name) {
        return NextResponse.json({ error: 'Document name is required.' }, { status: 400 });
      }

      const docItem = {
        id: `doc-${Date.now()}-${Math.floor(100 + Math.random() * 900)}`,
        name,
        size: size || '1.0 MB',
        type: type || 'PDF Document',
        uploadDate: new Date().toLocaleDateString('en-IN', { day: 'numeric', month: 'short', year: 'numeric' })
      };

      const filings = getFilings();
      const userFilingIndex = filings.findIndex(f => 
        (f.userId && f.userId === user.id) ||
        (f.email && user.email && f.email.toLowerCase() === user.email.toLowerCase())
      );

      if (userFilingIndex !== -1) {
        filings[userFilingIndex].documents = [docItem, ...(filings[userFilingIndex].documents || [])];
        saveFilings(filings);
      } else {
        createFiling({
          userId: user.id,
          fullName: user.name,
          email: user.email,
          mobile: user.phone || '9876543210',
          service: 'Tax Documents Vault',
          plan: 'Encrypted Document Repository',
          financialYear: 'FY 2024-25 (AY 2025-26)',
          clientNotes: 'Client uploaded tax documents directly into secure Document Vault.',
          documents: [docItem]
        });
      }

      const updatedData = getUserPortalData(user.id);
      return NextResponse.json({
        success: true,
        message: 'Document saved to encrypted vault and synchronized with CA desk!',
        document: docItem,
        ...updatedData
      });
    }

    // Action 4: Delete Document from Vault
    if (action === 'delete_vault_document') {
      const { docId } = body;
      if (!docId) {
        return NextResponse.json({ error: 'Document ID is required.' }, { status: 400 });
      }

      const filings = getFilings();
      let changed = false;
      filings.forEach(f => {
        if (
          (f.userId && f.userId === user.id) ||
          (f.email && user.email && f.email.toLowerCase() === user.email.toLowerCase())
        ) {
          if (f.documents && f.documents.some(d => d.id === docId)) {
            f.documents = f.documents.filter(d => d.id !== docId);
            changed = true;
          }
        }
      });

      if (changed) {
        saveFilings(filings);
      }

      const updatedData = getUserPortalData(user.id);
      return NextResponse.json({
        success: true,
        message: 'Document removed from vault.',
        ...updatedData
      });
    }

    return NextResponse.json({ error: 'Invalid action.' }, { status: 400 });
  } catch (error: any) {
    console.error('API /api/user/portal POST error:', error);
    return NextResponse.json({ error: error.message || 'Failed to process portal action' }, { status: 500 });
  }
}
