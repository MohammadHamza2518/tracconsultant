import { NextResponse } from 'next/server';
import { getUsers } from '@/lib/db';

export async function GET() {
  try {
    const users = getUsers();
    const safeUsers = users.map(({ password, ...rest }: any) => rest);
    return NextResponse.json({ users: safeUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}
