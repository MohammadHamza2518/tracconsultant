import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { email, name, avatar } = body;

    if (!email) {
      return NextResponse.json({ error: 'Google email is required.' }, { status: 400 });
    }

    let user = findUserByEmail(email);

    if (!user) {
      // Auto register via Google
      user = createUser({
        name: name || email.split('@')[0],
        email,
        authProvider: 'google',
        avatar: avatar || `https://api.dicebear.com/7.x/initials/svg?seed=${encodeURIComponent(name || email)}`,
        role: 'client'
      });
    }

    const { password: _, ...userSafe } = user as any;

    return NextResponse.json({
      success: true,
      message: 'Signed in with Google!',
      user: userSafe
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
