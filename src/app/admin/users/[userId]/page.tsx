import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";
import { UserCredentialsManager } from "@/components/admin/user-credentials-manager";
import clientPromise from "@/lib/mongodb";
import type { User, Credential, ActivityLog } from "@/lib/types";

const getUserData = async (userId: string) => {
  const client = await clientPromise;
  const db = client.db();

  const userRaw = await db.collection("users").findOne({ id: userId });
  const userCredentialsRaw = await db.collection("credentials").find({ userId: userId }).toArray();
  const userActivityRaw = await db.collection("activityLogs").find({ userId: userId }).toArray();

  const user: User | null = userRaw ? { ...userRaw, id: userRaw._id.toString() } as User : null;
  const userCredentials: Credential[] = userCredentialsRaw.map(c => ({ ...c, id: c._id.toString() })) as Credential[];
  const userActivity: ActivityLog[] = userActivityRaw.map(a => ({ ...a, id: a._id.toString() })) as ActivityLog[];
  
  return { user, userCredentials, userActivity };
};


export default async function AdminUserDetailPage({ params }: { params: { userId: string } }) {
  const { user, userCredentials, userActivity } = await getUserData(params.userId);

  if (!user) {
    return (
      <div>
        <PageHeader title="User Not Found" description="Could not find a user with this ID." />
        <Button asChild variant="outline">
          <Link href="/admin/dashboard">
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Dashboard
          </Link>
        </Button>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-4">
        <Button asChild variant="outline" size="icon" className="h-7 w-7">
          <Link href="/admin/dashboard">
            <ArrowLeft className="h-4 w-4" />
            <span className="sr-only">Back</span>
          </Link>
        </Button>
        <PageHeader
            title={user.name}
            description={`Manage credentials and view activity for ${user.email}.`}
        />
        <div className="ml-auto flex items-center gap-2">
            <Button variant="outline">
                <FileDown className="mr-2 h-4 w-4" />
                Export PDF
            </Button>
        </div>
      </div>

      <UserCredentialsManager user={user} initialCredentials={userCredentials} initialActivity={userActivity} />

    </div>
  );
}
