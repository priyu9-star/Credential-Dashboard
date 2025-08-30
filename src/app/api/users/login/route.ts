
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { User } from '@/lib/types';
import { WithId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { email, password } = await request.json();

    if (!email || !password) {
      return NextResponse.json({ error: 'Missing email or password' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const userFromDb = await db.collection('users').findOne({ email, password });

    if (!userFromDb) {
      return NextResponse.json({ error: 'Invalid email or password' }, { status: 401 });
    }
    
    // Explicitly map fields to ensure correct types, especially converting ObjectId to string
    const user: Partial<User> = {
        id: userFromDb._id.toString(),
        name: userFromDb.name,
        email: userFromDb.email,
        role: userFromDb.role,
        status: userFromDb.status,
        avatarUrl: userFromDb.avatarUrl,
    };
    
    // The password is not included in the new user object, so no need to delete it.

    return NextResponse.json({ user });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to authenticate user' }, { status: 500 });
  }
}
