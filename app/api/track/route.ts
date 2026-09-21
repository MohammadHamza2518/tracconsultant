import { NextRequest, NextResponse } from 'next/server';
import { findFilingsByPhoneOrId } from '@/lib/db';

export async function GET(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const query = searchParams.get('q') || searchParams.get('query');

    if (!query || query.trim().length < 4) {
      return NextResponse.json({
        success: false,
        error: 'Please enter at least 4 characters of your Application ID (e.g. TRAC-...) or 10-digit Mobile Number.'
      }, { status: 400 });
    }

    const results = findFilingsByPhoneOrId(query);

    // Also search CA Advisory Queries
    const { getCAQueries } = await import('@/lib/db');
    const allQueries = getCAQueries();
    const cleanSearch = query.trim().toLowerCase();
    const cleanPhone = query.replace(/\D/g, '');

    const matchingQueries = allQueries.filter(q => {
      const matchId = q.id.toLowerCase().includes(cleanSearch);
      const matchPhone = cleanPhone.length >= 4 && q.clientPhone.replace(/\D/g, '').includes(cleanPhone);
      return matchId || matchPhone;
    });

    // Sanitize sensitive items for public tracking view
    const sanitizedFilings = results.map(f => {
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
        type: 'filing',
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

    const sanitizedQueries = matchingQueries.map(q => {
      const parts = (q.clientName || 'Client').trim().split(/\s+/);
      const firstName = parts[0] || 'Client';
      const lastNameMasked = parts[1] ? parts[1][0] + '***' : '';
      const maskedName = lastNameMasked ? `${firstName} ${lastNameMasked}` : firstName;

      const rawPhone = (q.clientPhone || '').replace(/\D/g, '');
      const maskedPhone = rawPhone.length >= 4 
        ? `${rawPhone.slice(0, 2)}******${rawPhone.slice(-2)}`
        : '******';

      return {
        id: q.id,
        type: 'query',
        service: `CA Consultation (${q.category})`,
        plan: q.plan === 'priority' ? 'Priority Notice Desk' : 'Standard Written Opinion',
        fullName: maskedName,
        maskedMobile: maskedPhone,
        status: q.status,
        financialYear: 'AY 2025–26',
        assignedCA: q.assignedCA,
        querySubject: q.querySubject,
        caResponse: q.caResponse,
        timeline: [
          {
            step: '1',
            title: 'Query Registered & Paid',
            description: 'Consultation ticket registered with Senior CA cell',
            date: q.createdAt,
            completed: true,
            current: q.status === 'pending'
          },
          {
            step: '2',
            title: 'Under CA Legal Review',
            description: 'Chartered Accountant analyzing facts and drafting legal opinion',
            date: q.status !== 'pending' ? q.updatedAt : null,
            completed: q.status === 'in_review' || q.status === 'resolved',
            current: q.status === 'in_review'
          },
          {
            step: '3',
            title: 'Written Opinion Delivered',
            description: q.caResponse ? 'Solution delivered and verified by Senior CA' : 'Pending resolution',
            date: q.caResponse ? q.caResponse.respondedAt : null,
            completed: q.status === 'resolved',
            current: q.status === 'resolved'
          }
        ],
        createdAt: q.createdAt,
        updatedAt: q.updatedAt
      };
    });

    const combined = [...sanitizedFilings, ...sanitizedQueries];

    return NextResponse.json({
      success: true,
      count: combined.length,
      data: combined
    });
  } catch (error) {
    console.error('API /api/track error:', error);
    return NextResponse.json({ success: false, error: 'Failed to search filing status' }, { status: 500 });
  }
}
