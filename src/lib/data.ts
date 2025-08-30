import type { User, Credential, ActivityLog } from './types';

export const users: User[] = [
  {
    id: '1',
    name: 'Admin User',
    email: 'admin@example.com',
    role: 'admin',
    status: 'Onboarded',
    avatarUrl: 'https://picsum.photos/seed/admin/100/100',
  },
  {
    id: '2',
    name: 'Alice Johnson',
    email: 'alice@example.com',
    role: 'user',
    status: 'Pending',
    avatarUrl: 'https://picsum.photos/seed/alice/100/100',
  },
  {
    id: '3',
    name: 'Bob Williams',
    email: 'bob@example.com',
    role: 'user',
    status: 'Onboarded',
    avatarUrl: 'https://picsum.photos/seed/bob/100/100',
  },
  {
    id: '4',
    name: 'Charlie Brown',
    email: 'charlie@example.com',
    role: 'user',
    status: 'Offboarding-In-Progress',
    avatarUrl: 'https://picsum.photos/seed/charlie/100/100',
  },
];

export const credentials: Credential[] = [
  // Alice's credentials (Pending)
  {
    id: 'c1',
    userId: '2',
    name: 'Company Email',
    status: 'Assigned',
    assignedAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-01T10:00:00Z',
  },
  {
    id: 'c2',
    userId: '2',
    name: 'Slack Account',
    status: 'Assigned',
    assignedAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-01T10:00:00Z',
  },
  {
    id: 'c3',
    userId: '2',
    name: 'GitHub Access (Read)',
    status: 'Problem Reported',
    problemNote: "I can't see the private repositories.",
    assignedAt: '2023-10-01T10:00:00Z',
    updatedAt: '2023-10-02T14:00:00Z',
  },
  // Bob's credentials (Onboarded)
  {
    id: 'c4',
    userId: '3',
    name: 'Company Email',
    status: 'Confirmed',
    assignedAt: '2023-09-15T09:00:00Z',
    updatedAt: '2023-09-16T11:00:00Z',
  },
  {
    id: 'c5',
    userId: '3',
    name: 'Jira Account',
    status: 'Confirmed',
    assignedAt: '2023-09-15T09:00:00Z',
    updatedAt: '2023-09-16T11:30:00Z',
  },
  // Charlie's credentials (Offboarding)
  {
    id: 'c6',
    userId: '4',
    name: 'Company Email',
    status: 'Revoked/Inactive',
    assignedAt: '2023-08-01T09:00:00Z',
    updatedAt: '2023-10-10T17:00:00Z',
  },
  {
    id: 'c7',
    userId: '4',
    name: 'VPN Access',
    status: 'Assigned',
    assignedAt: '2023-08-01T09:00:00Z',
    updatedAt: '2023-08-02T10:00:00Z',
  },
];

export const activityLogs: ActivityLog[] = [
  {
    id: 'l1',
    userId: '2',
    userName: 'Alice Johnson',
    action: 'Problem Reported',
    details: 'Problem with GitHub Access (Read): I can\'t see the private repositories.',
    timestamp: '2023-10-02T14:00:00Z',
  },
  {
    id: 'l2',
    userId: '3',
    userName: 'Bob Williams',
    action: 'Credential Confirmed',
    details: 'Jira Account confirmed.',
    timestamp: '2023-09-16T11:30:00Z',
  },
  {
    id: 'l3',
    userId: '3',
    userName: 'Bob Williams',
    action: 'Status Change',
    details: 'User status changed to Onboarded.',
    timestamp: '2023-09-16T11:30:00Z',
  },
   {
    id: 'l4',
    userId: '4',
    userName: 'Charlie Brown',
    action: 'Offboarding Started',
    details: 'User status changed to Offboarding-In-Progress.',
    timestamp: '2023-10-10T16:00:00Z',
  },
  {
    id: 'l5',
    userId: '4',
    userName: 'Charlie Brown',
    action: 'Credential Revoked',
    details: 'Company Email marked as Revoked/Inactive.',
    timestamp: '2023-10-10T17:00:00Z',
  },
];
