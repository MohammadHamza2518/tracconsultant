import { NextRequest, NextResponse } from 'next/server';
import { getUsers, updateUser } from '@/lib/db';

export async function GET() {
  try {
    const users = getUsers();
    const safeUsers = users.map(({ password, ...rest }: any) => rest);
    return NextResponse.json({ users: safeUsers });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Internal error' }, { status: 500 });
  }
}

export async function PATCH(req: NextRequest) {
  try {
    const body = await req.json();
    const { userId, name, phone, role, avatar } = body;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required.' }, { status: 400 });
    }

    const updated = updateUser(userId, {
      ...(name !== undefined ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(avatar !== undefined ? { avatar: avatar || '' } : {})
    });

    if (!updated) {
      return NextResponse.json({ error: 'User not found.' }, { status: 404 });
    }

    const { password: _, ...safeUser } = updated as any;
    return NextResponse.json({ success: true, user: safeUser });
  } catch (error: any) {
    console.error('API /api/admin/users PATCH error:', error);
    return NextResponse.json({ error: error.message || 'Failed to update user' }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  return PATCH(req);
}
