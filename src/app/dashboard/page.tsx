import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  CheckCircle2,
  AlertTriangle,
  KeyRound,
  Hourglass,
  BadgeCheck,
  Ban,
  ClipboardX,
} from "lucide-react";

import { UserCredentialsClient } from "@/components/user/credentials-client";
import { PageHeader } from "@/components/page-header";
import clientPromise from "@/lib/mongodb";
import type { User, Credential } from "@/lib/types";
import { ObjectId } from "mongodb";
import useMockAuth from "@/hooks/use-mock-auth";

// In a real app, this would be fetched based on the logged-in user's session.
// We are temporarily using a hardcoded ID that matches our seed data for Rohan Sharma.
const MOCK_USER_ID = "668b0132b4737d87f7584883"; // This is the ObjectId for Rohan Sharma in the seed script

const getUserData = async () => {
  const client = await clientPromise;
  const db = client.db();

  // Find user by their ObjectId
  const userRaw = await db.collection("users").findOne({ _id: new ObjectId(MOCK_USER_ID) });

  // Find credentials using the string representation of the user's _id
  const userCredentialsRaw = await db.collection("credentials").find({ userId: MOCK_USER_ID }).toArray();
  
  const user: User | null = userRaw ? { ...userRaw, id: userRaw._id.toString() } as unknown as User : null;
  const userCredentials: Credential[] = userCredentialsRaw.map(c => ({...c, id: c._id.toString()})) as Credential[];

  return { user, userCredentials };
};

export default async function UserDashboardPage() {
  const { user, userCredentials } = await getUserData();

  if (!user) {
    return <div>User not found. Please seed the database by running `npm run db:seed`.</div>;
  }

  const stats = {
    assigned: userCredentials.filter((c) => c.status === "Assigned").length,
    confirmed: userCredentials.filter((c) => c.status === "Confirmed").length,
    problem: userCredentials.filter((c) => c.status === "Problem Reported").length,
    revoked: userCredentials.filter((c) => c.status === "Revoked/Inactive").length,
  };

  const statusInfo = {
    Pending: { icon: Hourglass, color: "text-yellow-500", description: "Please confirm all your credentials to complete onboarding." },
    Onboarded: { icon: BadgeCheck, color: "text-green-500", description: "You are fully onboarded. Welcome!" },
    "Offboarding-In-Progress": { icon: Ban, color: "text-orange-500", description: "Offboarding is in progress. Your access is being revoked." },
    Offboarded: { icon: ClipboardX, color: "text-red-500", description: "Your account has been fully offboarded." },
  };
  
  const CurrentStatusIcon = statusInfo[user.status].icon;

  return (
    <div className="space-y-6">
      <PageHeader
        title={`Welcome, ${user.name}!`}
        description="Here's an overview of your credential status."
      />

      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Overall Status</CardTitle>
            <CurrentStatusIcon className={`h-5 w-5 ${statusInfo[user.status].color}`} />
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${statusInfo[user.status].color}`}>{user.status}</div>
            <p className="text-xs text-muted-foreground">{statusInfo[user.status].description}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Assigned</CardTitle>
            <KeyRound className="h-5 w-5 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.assigned}</div>
            <p className="text-xs text-muted-foreground">Credentials waiting for confirmation.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Confirmed</CardTitle>
            <CheckCircle2 className="h-5 w-5 text-green-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.confirmed}</div>
             <p className="text-xs text-muted-foreground">Credentials you have confirmed.</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Problem Reports</CardTitle>
            <AlertTriangle className="h-5 w-5 text-red-500" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{stats.problem}</div>
            <p className="text-xs text-muted-foreground">Issues you have reported.</p>
          </CardContent>
        </Card>
      </div>

      <UserCredentialsClient initialCredentials={userCredentials} />
      
    </div>
  );
}
