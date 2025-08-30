import { users, credentials, activityLogs } from "@/lib/data";
import { PageHeader } from "@/components/page-header";
import { Button } from "@/components/ui/button";
import { ArrowLeft, FileDown } from "lucide-react";
import Link from "next/link";
import { UserCredentialsManager } from "@/components/admin/user-credentials-manager";

const getUserData = (userId: string) => {
  const user = users.find((u) => u.id === userId);
  const userCredentials = credentials.filter((c) => c.userId === userId);
  const userActivity = activityLogs.filter(log => log.userId === userId);

  return { user, userCredentials, userActivity };
};


export default function AdminUserDetailPage({ params }: { params: { userId: string } }) {
  const { user, userCredentials, userActivity } = getUserData(params.userId);

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
