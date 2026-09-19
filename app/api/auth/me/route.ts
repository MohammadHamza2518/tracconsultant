import { NextRequest, NextResponse } from 'next/server';
import { findUserById, findUserByEmail } from '@/lib/db';

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url);
  const id = searchParams.get('id');
  const email = searchParams.get('email');

  let user = null;
  if (id) user = findUserById(id);
  else if (email) user = findUserByEmail(email);

  if (!user) {
    return NextResponse.json({ error: 'User not found' }, { status: 404 });
  }

  const { password: _, ...userSafe } = user as any;
  return NextResponse.json({ user: userSafe });
}
