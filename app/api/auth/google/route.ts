import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser, syncUserPurchasedTools } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    let email = body.email;
    let name = body.name;
    let avatar = body.avatar;

    // Support real Google Identity Services JWT credential
    if (body.credential) {
      try {
        const parts = body.credential.split('.');
        if (parts.length === 3) {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString('utf-8'));
          if (payload.email) email = payload.email;
          if (payload.name) name = payload.name;
          if (payload.picture) avatar = payload.picture;
        }
      } catch (e) {
        console.error('Failed to decode Google credential JWT:', e);
      }
    }

    if (!email) {
      return NextResponse.json({ error: 'Google email is required.' }, { status: 400 });
    }

    let user = findUserByEmail(email);

    if (!user) {
      // Auto register new client via Google
      user = createUser({
        name: name || email.split('@')[0],
        email: email.toLowerCase().trim(),
        authProvider: 'google',
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
        role: 'client'
      });
    }

    const synced = syncUserPurchasedTools(user);
    const { password: _, ...userSafe } = synced as any;

    return NextResponse.json({
      success: true,
      message: 'Signed in with Google!',
      user: userSafe
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
