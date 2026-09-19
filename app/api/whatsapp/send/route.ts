import { NextRequest, NextResponse } from 'next/server';
import { getTemplates, getWhatsAppSettings, getFilingById, updateFiling } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { phone, templateId, customMessage, variables, filingId } = body;

    if (!phone) {
      return NextResponse.json({ success: false, error: 'Phone number is required' }, { status: 400 });
    }

    // Clean phone number (add India country code 91 if 10 digits)
    let cleanPhone = phone.replace(/[^0-9]/g, '');
    if (cleanPhone.length === 10) {
      cleanPhone = '91' + cleanPhone;
    }

    let finalMessage = customMessage || '';

    if (templateId) {
      const templates = getTemplates();
      const template = templates.find(t => t.id === templateId);
      if (template) {
        finalMessage = template.content;
      }
    }

    // Substitute variables
    if (variables && finalMessage) {
      Object.keys(variables).forEach(key => {
        const regex = new RegExp(`{${key}}`, 'g');
        finalMessage = finalMessage.replace(regex, variables[key] || '');
      });
    }

    const encodedMessage = encodeURIComponent(finalMessage);
    const whatsappWebUrl = `https://api.whatsapp.com/send?phone=${cleanPhone}&text=${encodedMessage}`;
    const waMeUrl = `https://wa.me/${cleanPhone}?text=${encodedMessage}`;

    // If a filingId was passed, log this dispatch in the filing record
    if (filingId) {
      const filing = getFilingById(filingId);
      if (filing) {
        const logs = filing.whatsappLogs || [];
        logs.unshift({
          lastSentAt: new Date().toISOString(),
          templateId: templateId || 'custom',
          status: 'sent'
        });
        updateFiling(filingId, { whatsappLogs: logs });
      }
    }

    return NextResponse.json({
      success: true,
      message: 'WhatsApp link & payload generated successfully',
      finalText: finalMessage,
      targetPhone: cleanPhone,
      whatsappWebUrl,
      waMeUrl
    });
  } catch (error) {
    console.error('API /api/whatsapp/send error:', error);
    return NextResponse.json({ success: false, error: 'Failed to process WhatsApp dispatch' }, { status: 500 });
  }
}
