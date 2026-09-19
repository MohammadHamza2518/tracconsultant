import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const existing = findUserByEmail(email);
    if (existing) {
      return NextResponse.json({ error: 'An account with this email already exists. Please login.' }, { status: 409 });
    }

    const newUser = createUser({
      name,
      email,
      phone: phone || '',
      password: password || 'default123',
      authProvider: 'email',
      role: 'client'
    });

    // Remove password before sending to client
    const { password: _, ...userSafe } = newUser as any;

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: userSafe
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
