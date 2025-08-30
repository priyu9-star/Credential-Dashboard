import { ObjectId } from 'mongodb';

export type UserRole = "admin" | "user";

export type UserStatus = "Pending" | "Onboarded" | "Offboarding-In-Progress" | "Offboarded";

export type CredentialStatus = "Assigned" | "Confirmed" | "Problem Reported" | "Revoked/Inactive";

export interface User {
  _id: ObjectId;
  id: string;
  name: string;
  email: string;
  password?: string; // Should be handled securely, not stored in plaintext in a real app
  role: UserRole;
  status: UserStatus;
  avatarUrl: string;
}

export interface Credential {
  _id: ObjectId;
  id: string;
  userId: string;
  name: string;
  status: CredentialStatus;
  problemNote?: string;
  adminNote?: string;
  assignedAt: string;
  updatedAt: string;
}

export interface ActivityLog {
  _id: ObjectId;
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  timestamp: string;
  details: string;
}
