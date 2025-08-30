export type UserRole = "admin" | "user";

export type UserStatus = "Pending" | "Onboarded" | "Offboarding-In-Progress" | "Offboarded";

export type CredentialStatus = "Assigned" | "Confirmed" | "Problem Reported" | "Revoked/Inactive";

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  status: UserStatus;
  avatarUrl: string;
}

export interface Credential {
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
  id: string;
  userId?: string;
  userName?: string;
  action: string;
  timestamp: string;
  details: string;
}
