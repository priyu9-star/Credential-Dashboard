import Link from "next/link";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Users,
  Hourglass,
  BadgeCheck,
  AlertTriangle,
  FileDown,
} from "lucide-react";

import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { UsersTable } from "@/components/admin/users-table";
import clientPromise from "@/lib/mongodb";
import type { User, Credential } from "@/lib/types";

const getDashboardData = async () => {
  const client = await clientPromise;
  const db = client.db();
  const usersRaw = await db.collection("users").find({}).toArray();
  const credentialsRaw = await db.collection("credentials").find({}).toArray();

  const users: User[] = usersRaw.map(u => ({...u, id: u._id.toString()})) as User[];
  const credentials: Credential[] = credentialsRaw.map(c => ({...c, id: c._id.toString()})) as Credential[];

  const totalUsers = users.filter(u => u.role === 'user').length;
  const pendingUsers = users.filter(u => u.status === 'Pending').length;
  const onboardedUsers = users.filter(u => u.status === 'Onboarded').length;
  const problemCredentials = credentials.filter(c => c.status === 'Problem Reported').length;

  return { totalUsers, pendingUsers, onboardedUsers, problemCredentials };
};

export default async function AdminDashboardPage() {
  const { totalUsers, pendingUsers, onboardedUsers, problemCredentials } = await getDashboardData();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Admin Dashboard"
        description="Overview of all users and credential statuses."
      >
        <Button variant="outline">
            <FileDown className="mr-2 h-4 w-4" />
            Export Reports
        </Button>
      </PageHeader>
      
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Users</CardTitle>
            <Users className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{totalUsers}</div>
            <p className="text-xs text-muted-foreground">Total number of users managed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Pending Onboarding</CardTitle>
            <Hourglass className="h-5 w-5 text-yellow-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{pendingUsers}</div>
            <p className="text-xs text-muted-foreground">Users yet to be fully onboarded.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Fully Onboarded</CardTitle>
            <BadgeCheck className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{onboardedUsers}</div>
            <p className="text-xs text-muted-foreground">Users who have confirmed all credentials.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Problem Reports</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{problemCredentials}</div>
            <p className="text-xs text-muted-foreground">Credentials with reported issues.</p>
          </CardContent>
        </Card>
      </div>

      <Card id="users">
        <CardHeader>
            <CardTitle>User Management</CardTitle>
            <CardDescription>View user details, manage credentials, and track onboarding progress.</CardDescription>
        </CardHeader>
        <CardContent>
            <UsersTable />
        </CardContent>
      </Card>

    </div>
  );
}
