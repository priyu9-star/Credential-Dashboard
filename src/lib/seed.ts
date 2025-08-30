// Use this script to seed your MongoDB database with initial data.
// Run `npm run db:seed` to execute.

import { MongoClient, ObjectId } from 'mongodb';
import type { User, Credential, ActivityLog } from './types';

// Load environment variables
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });


const uri = process.env.MONGODB_URI;
if (!uri) {
  throw new Error('MONGODB_URI is not set in the environment variables');
}

const client = new MongoClient(uri);

// Define ObjectIDs first so they can be referenced
const adminId = new ObjectId("668b0132b4737d87f7584882");
const userId1 = new ObjectId("668b0132b4737d87f7584883");
const userId2 = new ObjectId("668b0132b4737d87f7584884");
const userId3 = new ObjectId("668b0132b4737d87f7584885");

const users: Omit<User, 'id'>[] = [
  {
    _id: adminId,
    name: 'Priya Patel',
    email: 'priya.patel@example.com',
    role: 'admin',
    status: 'Onboarded',
    avatarUrl: 'https://i.pravatar.cc/150?u=priya',
  },
  {
    _id: userId1, // Rohan Sharma
    name: 'Rohan Sharma',
    email: 'rohan.sharma@example.com',
    role: 'user',
    status: 'Pending',
    avatarUrl: 'https://i.pravatar.cc/150?u=rohan',
  },
  {
    _id: userId2, // Ananya Singh
    name: 'Ananya Singh',
    email: 'ananya.singh@example.com',
    role: 'user',
    status: 'Onboarded',
    avatarUrl: 'https://i.pravatar.cc/150?u=ananya',
  },
  {
    _id: userId3, // Vikram Rao
    name: 'Vikram Rao',
    email: 'vikram.rao@example.com',
    role: 'user',
    status: 'Offboarded',
    avatarUrl: 'https://i.pravatar.cc/150?u=vikram',
  },
];

const credentials: Omit<Credential, 'id'>[] = [
  // Rohan Sharma's Credentials
  {
    _id: new ObjectId(),
    userId: userId1.toString(),
    name: 'GitHub',
    status: 'Assigned',
    assignedAt: new Date('2023-10-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-01T10:00:00Z').toISOString(),
  },
  {
    _id: new ObjectId(),
    userId: userId1.toString(),
    name: 'Jira',
    status: 'Confirmed',
    assignedAt: new Date('2023-10-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-02T11:00:00Z').toISOString(),
  },
  {
    _id: new ObjectId(),
    userId: userId1.toString(),
    name: 'Slack',
    status: 'Problem Reported',
    problemNote: "I can't seem to log in, getting an authentication error.",
    assignedAt: new Date('2023-10-01T10:00:00Z').toISOString(),
    updatedAt: new Date('2023-10-03T12:00:00Z').toISOString(),
  },
  // Ananya Singh's Credentials
  {
    _id: new ObjectId(),
    userId: userId2.toString(),
    name: 'GitHub',
    status: 'Confirmed',
    assignedAt: new Date('2023-09-15T09:00:00Z').toISOString(),
    updatedAt: new Date('2023-09-16T14:00:00Z').toISOString(),
  },
  {
    _id: new ObjectId(),
    userId: userId2.toString(),
    name: 'AWS Console',
    status: 'Confirmed',
    assignedAt: new Date('2023-09-15T09:00:00Z').toISOString(),
    updatedAt: new Date('2023-09-17T15:30:00Z').toISOString(),
  },
];

const activityLogs: Omit<ActivityLog, 'id'>[] = [
  {
    _id: new ObjectId(),
    userId: adminId.toString(),
    action: 'Assign Credential',
    timestamp: new Date('2023-10-01T10:00:00Z').toISOString(),
    details: `Assigned GitHub to Rohan Sharma`,
  },
  {
    _id: new ObjectId(),
    userId: userId1.toString(),
    action: 'Confirm Credential',
    timestamp: new Date('2023-10-02T11:00:00Z').toISOString(),
    details: 'Confirmed Jira access',
  },
  {
    _id: new ObjectId(),
    userId: userId1.toString(),
    action: 'Report Problem',
    timestamp: new Date('2023-10-03T12:00:00Z').toISOString(),
    details: 'Reported issue with Slack: "I can\'t seem to log in..."',
  },
    {
    _id: new ObjectId(),
    userId: adminId.toString(),
    action: 'System Maintenance',
    timestamp: new Date('2023-10-05T18:00:00Z').toISOString(),
    details: 'Scheduled maintenance completed successfully.',
  },
];


async function seed() {
  try {
    await client.connect();
    console.log('Connected to MongoDB');

    const db = client.db();

    // Clear existing data
    await db.collection('users').deleteMany({});
    await db.collection('credentials').deleteMany({});
    await db.collection('activityLogs').deleteMany({});
    console.log('Cleared existing data');

    // Insert new data
    await db.collection('users').insertMany(users as any);
    await db.collection('credentials').insertMany(credentials as any);
    await db.collection('activityLogs').insertMany(activityLogs as any);
    console.log('Database seeded successfully!');

  } catch (err) {
    console.error('Error seeding database:', err);
  } finally {
    await client.close();
    console.log('MongoDB connection closed');
  }
}

seed();
