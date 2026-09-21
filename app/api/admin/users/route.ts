import { NextRequest, NextResponse } from 'next/server';
import { getUsers, updateUser, createUser, findUserById, findUserByEmail } from '@/lib/db';

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
    const { userId, email, name, phone, role, avatar } = body;
    if (!userId && !email) {
      return NextResponse.json({ error: 'User ID or Email is required.' }, { status: 400 });
    }

    const targetIdentifier = userId || email;
    let updated = updateUser(targetIdentifier, {
      ...(email ? { email: email.toLowerCase().trim() } : {}),
      ...(name !== undefined ? { name } : {}),
      ...(phone !== undefined ? { phone } : {}),
      ...(role !== undefined ? { role } : {}),
      ...(avatar !== undefined ? { avatar: avatar || '' } : {})
    });

    if (!updated && email) {
      updated = updateUser(email, {
        email: email.toLowerCase().trim(),
        ...(name !== undefined ? { name } : {}),
        ...(phone !== undefined ? { phone } : {}),
        ...(role !== undefined ? { role } : {}),
        ...(avatar !== undefined ? { avatar: avatar || '' } : {})
      });
    }

    if (!updated) {
      const targetEmail = email || (userId && userId.includes('@') ? userId : null);
      if (targetEmail) {
        const created = createUser({
          id: userId && !userId.includes('@') ? userId : undefined,
          email: targetEmail.toLowerCase().trim(),
          name: name || targetEmail.split('@')[0],
          phone: phone || '',
          role: role || 'client',
          avatar: avatar || ''
        });
        const { password: _, ...safeUser } = created as any;
        return NextResponse.json({ success: true, user: safeUser });
      }
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
