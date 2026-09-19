import { NextRequest, NextResponse } from 'next/server';

export async function POST(req: NextRequest) {
  try {
    const { password, email } = await req.json();

    // Default admin credentials
    // Allow either email + password or master PIN
    const validPasscodes = ['admin123', 'trac2025', 'tracconsultant', 'admin@trac'];
    
    if (validPasscodes.includes(password)) {
      return NextResponse.json({
        success: true,
        message: 'Admin authenticated successfully',
        admin: {
          name: 'Super Admin',
          email: email || 'admin@tracconsultant.com',
          role: 'Admin / Managing CA',
          sessionToken: 'trac_admin_session_' + Date.now()
        }
      });
    }

    return NextResponse.json({ success: false, error: 'Invalid admin passcode or password.' }, { status: 401 });
  } catch (error) {
    console.error('API /api/admin/login error:', error);
    return NextResponse.json({ success: false, error: 'Authentication failed' }, { status: 500 });
  }
}
