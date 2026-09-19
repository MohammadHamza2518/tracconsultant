import { NextRequest, NextResponse } from 'next/server';
import { findUserByEmail, createUser, updateUser, syncUserPurchasedTools } from '@/lib/db';

export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const { name, email, password, phone } = body;

    if (!email || !name) {
      return NextResponse.json({ error: 'Name and email are required.' }, { status: 400 });
    }

    const existing = findUserByEmail(email);
    if (existing) {
      // If user was created during guest payment (or has default password), upgrade account seamlessly
      if (!existing.password || existing.password === 'default123') {
        const updated = updateUser(existing.id, {
          name: name || existing.name,
          phone: phone || existing.phone,
          password: password || 'default123'
        });
        const synced = syncUserPurchasedTools(updated || existing);
        const { password: _, ...userSafe } = synced as any;
        return NextResponse.json({
          success: true,
          message: 'Account activated and synced with your verified purchases!',
          user: userSafe
        }, { status: 200 });
      }

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

    const synced = syncUserPurchasedTools(newUser);
    // Remove password before sending to client
    const { password: _, ...userSafe } = synced as any;

    return NextResponse.json({
      success: true,
      message: 'Account created successfully!',
      user: userSafe
    }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
