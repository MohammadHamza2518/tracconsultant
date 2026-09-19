import { NextRequest, NextResponse } from 'next/server';
import { findFilingsByPhoneOrId } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q');

    if (!query || query.trim().length < 4) {
      return NextResponse.json({
        success: false,
        error: 'Please enter at least 4 characters of your Application ID (e.g. TRAC-...) or 10-digit Mobile Number.'
      }, { status: 400 });
    }

    const results = findFilingsByPhoneOrId(query);

    // Sanitize sensitive items for public tracking view
    const sanitized = results.map(f => {
      const parts = (f.fullName || 'Client').trim().split(/\s+/);
      const firstName = parts[0] || 'Client';
      const lastNameMasked = parts[1] ? parts[1][0] + '***' : '';
      const maskedName = lastNameMasked ? `${firstName} ${lastNameMasked}` : firstName;

      const rawPhone = (f.mobile || '').replace(/\D/g, '');
      const maskedPhone = rawPhone.length >= 4 
        ? `${rawPhone.slice(0, 2)}******${rawPhone.slice(-2)}`
        : '******';

      return {
        id: f.id,
        service: f.service,
        plan: f.plan,
        fullName: maskedName,
        maskedMobile: maskedPhone,
        status: f.status,
        financialYear: f.financialYear,
        assignedCA: f.assignedCA,
        estimatedRefund: f.estimatedRefund,
        timeline: f.timeline || [],
        createdAt: f.createdAt,
        updatedAt: f.updatedAt
      };
    });

    return NextResponse.json({
      success: true,
      count: sanitized.length,
      data: sanitized
    });
  } catch (error) {
    console.error('API /api/track error:', error);
    return NextResponse.json({ success: false, error: 'Failed to search filing status' }, { status: 500 });
  }
}
