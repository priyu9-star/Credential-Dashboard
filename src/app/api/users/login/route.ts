import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { User } from '@/lib/types';

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
    
    // Ensure the response has a string 'id'
    const user: User = { 
        ...userFromDb, 
        id: userFromDb._id.toString() 
    } as unknown as User;

    // Don't return the password
    delete user.password;


    return NextResponse.json({ user });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to authenticate user' }, { status: 500 });
  }
}
