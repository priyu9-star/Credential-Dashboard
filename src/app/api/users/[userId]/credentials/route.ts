
import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { Credential } from '@/lib/types';
import { ObjectId } from 'mongodb';

export async function GET(request: Request, { params }: { params: { userId: string } }) {
  try {
    const userId = params.userId;
    if (!userId) {
      return NextResponse.json({ error: 'User ID is required' }, { status: 400 });
    }

    const client = await clientPromise;
    const db = client.db();

    // Use the string version of the user's ID to find their credentials
    const credentialsFromDb = await db.collection('credentials').find({ userId }).toArray();

    const credentials: Credential[] = credentialsFromDb.map(c => ({...c, id: c._id.toString()})) as Credential[];

    return NextResponse.json({ credentials });

  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch credentials' }, { status: 500 });
  }
}
