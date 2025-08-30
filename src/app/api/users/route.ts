import { NextResponse } from 'next/server';
import clientPromise from '@/lib/mongodb';
import type { User, Credential } from '@/lib/types';
import { ObjectId } from 'mongodb';

type UserWithCounts = User & {
  credentialCounts: {
    assigned: number;
    confirmed: number;
    problem: number;
    revoked: number;
  };
};

export async function GET(request: Request) {
  try {
    const client = await clientPromise;
    const db = client.db();
    const { searchParams } = new URL(request.url);
    const getAll = searchParams.get('all');

    const usersFromDb = await db.collection('users').find({}).toArray();
    const users: User[] = usersFromDb.map(u => ({ ...u, id: u._id.toString() })) as User[];
    
    if (getAll) {
        return NextResponse.json({ users });
    }

    const credentialsFromDb = await db.collection('credentials').find({}).toArray();
    const credentials: Credential[] = credentialsFromDb.map(c => ({...c, id: c._id.toString() })) as Credential[];

    const usersWithCounts: UserWithCounts[] = users
      .filter(user => user.role === 'user')
      .map(user => {
        const userCredentials = credentials.filter(c => c.userId === user.id);
        return {
          ...user,
          credentialCounts: {
            assigned: userCredentials.filter(c => c.status === 'Assigned').length,
            confirmed: userCredentials.filter(c => c.status === 'Confirmed').length,
            problem: userCredentials.filter(c => c.status === 'Problem Reported').length,
            revoked: userCredentials.filter(c => c.status === 'Revoked/Inactive').length,
          }
        };
      });

    return NextResponse.json({ usersWithCounts });
  } catch (e) {
    console.error(e);
    return NextResponse.json({ error: 'Failed to fetch users' }, { status: 500 });
  }
}
