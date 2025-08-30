"use client";

import { useState } from "react";
import type { Credential, User, ActivityLog, CredentialStatus } from "@/lib/types";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
  CardFooter,
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useToast } from "@/hooks/use-toast";
import { format, formatDistanceToNow } from "date-fns";
import {
  MoreHorizontal,
  PlusCircle,
  CheckCircle2,
  AlertTriangle,
  Hourglass,
  XCircle,
  Edit,
  Trash2,
  History,
  Info
} from "lucide-react";
import { Avatar, AvatarFallback, AvatarImage } from "../ui/avatar";

type ManagerProps = {
  user: User;
  initialCredentials: Credential[];
  initialActivity: ActivityLog[];
};

const statusConfig: Record<
  CredentialStatus,
  { icon: React.ElementType; color: string; badgeVariant: "default" | "secondary" | "destructive" | "outline" }
> = {
  Assigned: { icon: Hourglass, color: "text-yellow-500", badgeVariant: "secondary" },
  Confirmed: { icon: CheckCircle2, color: "text-green-500", badgeVariant: "default" },
  "Problem Reported": { icon: AlertTriangle, color: "text-red-500", badgeVariant: "destructive" },
  "Revoked/Inactive": { icon: XCircle, color: "text-gray-500", badgeVariant: "outline" },
};

export function UserCredentialsManager({ user, initialCredentials, initialActivity }: ManagerProps) {
  const [credentials, setCredentials] = useState(initialCredentials);
  const [activity, setActivity] = useState(initialActivity);
  const [isCredentialDialogOpen, setCredentialDialogOpen] = useState(false);
  const [editingCredential, setEditingCredential] = useState<Credential | null>(null);
  const [newCredentialName, setNewCredentialName] = useState("");
  const { toast } = useToast();

  const handleSaveCredential = () => {
    // Add logic to save/update credential
    toast({ title: "Credential saved" });
    setCredentialDialogOpen(false);
  };
  
  const problemReports = credentials.filter(c => c.status === 'Problem Reported');

  return (
    <div className="grid gap-6 lg:grid-cols-3">
      <div className="lg:col-span-2 space-y-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Credentials</CardTitle>
              <CardDescription>
                Add, edit, or revoke credentials for this user.
              </CardDescription>
            </div>
            <Button size="sm" onClick={() => setCredentialDialogOpen(true)}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Credential
            </Button>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((cred) => (
                  <TableRow key={cred.id}>
                    <TableCell className="font-medium">{cred.name}</TableCell>
                    <TableCell>
                      <Badge variant={statusConfig[cred.status].badgeVariant} className="gap-1.5">
                        {statusConfig[cred.status].icon({className: `h-3.5 w-3.5 ${statusConfig[cred.status].color}`})}
                        {cred.status}
                      </Badge>
                    </TableCell>
                    <TableCell>
                      {format(new Date(cred.updatedAt), "PP")}
                    </TableCell>
                    <TableCell className="text-right">
                       <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="ghost" className="h-8 w-8 p-0">
                              <span className="sr-only">Open menu</span>
                              <MoreHorizontal className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem onClick={() => { setEditingCredential(cred); setCredentialDialogOpen(true); }}>
                              <Edit className="mr-2 h-4 w-4" />
                              <span>Edit</span>
                            </DropdownMenuItem>
                            <DropdownMenuItem className="text-red-500 focus:text-red-500 focus:bg-red-50 dark:focus:bg-red-900/20">
                              <Trash2 className="mr-2 h-4 w-4" />
                              <span>Delete</span>
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>

        {problemReports.length > 0 && (
          <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-red-600">
                    <AlertTriangle />
                    Problem Reports
                </CardTitle>
                <CardDescription>
                    Review and resolve issues reported by the user.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                  {problemReports.map(cred => (
                    <div key={cred.id} className="p-4 bg-muted/50 rounded-lg">
                        <p className="font-semibold">{cred.name}</p>
                        <p className="text-sm italic text-muted-foreground my-2">"{cred.problemNote}"</p>
                        <Button size="sm">Resolve Issue</Button>
                    </div>
                  ))}
              </CardContent>
          </Card>
        )}
      </div>

      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle>User Profile</CardTitle>
          </CardHeader>
          <CardContent className="flex flex-col items-center text-center">
            <Avatar className="h-24 w-24 mb-4">
              <AvatarImage src={user.avatarUrl} alt={user.name} />
              <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
            </Avatar>
            <h3 className="text-xl font-semibold">{user.name}</h3>
            <p className="text-muted-foreground">{user.email}</p>
            <Badge className="mt-4">{user.status}</Badge>
          </CardContent>
          <CardFooter>
            <Button className="w-full" variant="destructive">Start Offboarding</Button>
          </CardFooter>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
                <History />
                Activity
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="space-y-4">
              {activity.slice(0, 5).map(log => (
                 <li key={log.id} className="flex gap-3">
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Info className="h-4 w-4"/>
                    </div>
                    <div>
                        <p className="text-sm font-medium">{log.action}</p>
                        <p className="text-xs text-muted-foreground">{log.details}</p>
                        <p className="text-xs text-muted-foreground">{formatDistanceToNow(new Date(log.timestamp), { addSuffix: true })}</p>
                    </div>
                 </li>
              ))}
            </ul>
          </CardContent>
        </Card>
      </div>

       <Dialog open={isCredentialDialogOpen} onOpenChange={setCredentialDialogOpen}>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingCredential ? 'Edit' : 'Add'} Credential</DialogTitle>
              <DialogDescription>
                Fill in the details for the credential.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid gap-2">
                <Label htmlFor="cred-name">Credential Name</Label>
                <Input
                  id="cred-name"
                  value={newCredentialName}
                  onChange={(e) => setNewCredentialName(e.target.value)}
                  placeholder="e.g., GitHub, Slack"
                />
              </div>
            </div>
            <DialogFooter>
              <Button variant="outline" onClick={() => setCredentialDialogOpen(false)}>Cancel</Button>
              <Button onClick={handleSaveCredential}>Save Credential</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
    </div>
  );
}
