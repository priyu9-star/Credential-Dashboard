import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import { ObjectId } from 'mongodb';

export async function POST(request: Request) {
  try {
    const { name, email, password } = await request.json();

    if (!name || !email || !password) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    const existingUser = await db.collection('users').findOne({ email });
    if (existingUser) {
      return NextResponse.json({ error: 'User with this email already exists' }, { status: 409 });
    }

    const newUser = {
      _id: new ObjectId(),
      name,
      email,
      password, // In a real app, hash and salt this password!
      role: 'user',
      status: 'Pending',
      avatarUrl: `https://i.pravatar.cc/150?u=${email}`,
    };

    await db.collection('users').insertOne(newUser);
    
    // Don't return the password in the response
    const { password: _, ...userToReturn } = newUser;

    return NextResponse.json({ user: userToReturn }, { status: 201 });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to create user' }, { status: 500 });
  }
}
