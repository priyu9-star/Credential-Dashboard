import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";
import { UserCredentialsManager } from "@/components/admin/user-credentials-manager";
import clientPromise from "@/lib/mongodb";
import type { User, Credential, ActivityLog } from "@/lib/types";
import { ObjectId } from "mongodb";

const getUserData = async (userId: string) => {
  const client = await clientPromise;
  const db = client.db();

  const user = await db.collection<User>("users").findOne({ id: userId });
  const userCredentials = await db.collection<Credential>("credentials").find({ userId: userId }).toArray();
  const userActivity = await db.collection<ActivityLog>("activityLogs").find({ userId: userId }).toArray();
  
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

  const plainUser = JSON.parse(JSON.stringify(user));
  const plainCredentials = JSON.parse(JSON.stringify(userCredentials));
  const plainActivity = JSON.parse(JSON.stringify(userActivity));


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

      <UserCredentialsManager user={plainUser} initialCredentials={plainCredentials} initialActivity={plainActivity} />

    </div>
  );
}
