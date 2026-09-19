import { NextRequest, NextResponse } from 'next/server';
import { getTemplates, saveTemplates, getWhatsAppSettings, saveWhatsAppSettings } from '@/lib/db';

export async function GET() {
  try {
    const templates = getTemplates();
    const settings = getWhatsAppSettings();
    return NextResponse.json({ success: true, templates, settings });
  } catch (error) {
    console.error('API /api/whatsapp/templates GET error:', error);
    return NextResponse.json({ success: false, error: 'Failed to fetch templates' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();

    if (body.action === 'save_settings' && body.settings) {
      saveWhatsAppSettings(body.settings);
      return NextResponse.json({ success: true, message: 'Settings updated', settings: body.settings });
    }

    if (body.action === 'save_templates' && Array.isArray(body.templates)) {
      saveTemplates(body.templates);
      return NextResponse.json({ success: true, message: 'Templates saved', templates: body.templates });
    }

    return NextResponse.json({ success: false, error: 'Invalid action' }, { status: 400 });
  } catch (error) {
    console.error('API /api/whatsapp/templates POST error:', error);
    return NextResponse.json({ success: false, error: 'Failed to update templates' }, { status: 500 });
  }
}
