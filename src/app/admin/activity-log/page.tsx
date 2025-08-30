import { PageHeader } from "@/components/page-header";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { activityLogs } from "@/lib/data";
import { format } from 'date-fns';
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { users } from "@/lib/data";
import { Badge } from "@/components/ui/badge";

export default function ActivityLogPage() {
    const logsWithUsers = activityLogs.map(log => {
        const user = users.find(u => u.id === log.userId);
        return {
            ...log,
            user,
        }
    }).sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

  return (
    <div className="space-y-6">
      <PageHeader
        title="Activity Log"
        description="An immutable log of all key actions across the system."
      />
      <Card>
        <CardHeader>
          <CardTitle>All Activities</CardTitle>
          <CardDescription>
            Chronological record of assignments, confirmations, reports, and status changes.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Action</TableHead>
                <TableHead>Details</TableHead>
                <TableHead className="text-right">Timestamp</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {logsWithUsers.map((log) => (
                <TableRow key={log.id}>
                  <TableCell>
                    {log.user ? (
                         <div className="flex items-center gap-3">
                            <Avatar className="h-9 w-9">
                                <AvatarImage src={log.user.avatarUrl} alt={log.user.name} />
                                <AvatarFallback>{log.user.name.charAt(0)}</AvatarFallback>
                            </Avatar>
                            <span className="font-medium">{log.user.name}</span>
                        </div>
                    ) : (
                        <span>System</span>
                    )}
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary">{log.action}</Badge>
                  </TableCell>
                  <TableCell className="max-w-sm truncate">{log.details}</TableCell>
                  <TableCell className="text-right text-muted-foreground">
                    {format(new Date(log.timestamp), "PPp")}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
}
