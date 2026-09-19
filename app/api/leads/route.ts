import { NextRequest, NextResponse } from 'next/server';
import { getLeads, createLead, updateLeadStatus, deleteLead } from '@/lib/db';

export async function GET() {
  try {
    const leads = getLeads();
    return NextResponse.json({ leads });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { fullName, mobile, email, serviceInterest, message, city, source } = body;

    if (!fullName || !mobile) {
      return NextResponse.json({ error: 'Full name and mobile number are required.' }, { status: 400 });
    }

    const newLead = createLead({
      fullName,
      mobile,
      email: email || '',
      serviceInterest: serviceInterest || 'General CA Consultation',
      message: message || '',
      city: city || '',
      source: source || 'Website Service Form'
    });

    return NextResponse.json({
      success: true,
      message: 'Consultation request received! Our Senior CA will contact you within 30 minutes.',
      lead: newLead
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { leadId, status } = body;

    if (!leadId || !status) {
      return NextResponse.json({ error: 'leadId and status are required' }, { status: 400 });
    }

    const updated = updateLeadStatus(leadId, status);
    if (!updated) {
      return NextResponse.json({ error: 'Lead not found' }, { status: 404 });
    }

    return NextResponse.json({ success: true, message: 'Lead status updated' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');
    if (!id) {
      return NextResponse.json({ error: 'Lead ID required' }, { status: 400 });
    }
    const success = deleteLead(id);
    return NextResponse.json({ success, message: success ? 'Lead deleted' : 'Lead not found' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
