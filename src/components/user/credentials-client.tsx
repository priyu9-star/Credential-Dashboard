"use client";

import { useState } from "react";
import type { Credential, CredentialStatus } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { format } from 'date-fns';
import {
  CheckCircle2,
  AlertTriangle,
  Hourglass,
  XCircle,
  FileWarning,
  Check,
} from "lucide-react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
  DialogFooter,
} from "@/components/ui/dialog";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";

type UserCredentialsClientProps = {
  initialCredentials: Credential[];
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

export function UserCredentialsClient({
  initialCredentials,
}: UserCredentialsClientProps) {
  const [credentials, setCredentials] = useState<Credential[]>(initialCredentials);
  const [isReportDialogOpen, setReportDialogOpen] = useState(false);
  const [selectedCredential, setSelectedCredential] = useState<Credential | null>(null);
  const [problemNote, setProblemNote] = useState("");
  const { toast } = useToast();

  const handleConfirm = (id: string) => {
    setCredentials((prev) =>
      prev.map((c) => (c.id === id ? { ...c, status: "Confirmed", updatedAt: new Date().toISOString() } : c))
    );
    toast({
      title: "Credential Confirmed",
      description: "You have successfully confirmed the credential.",
    });
  };

  const openReportDialog = (credential: Credential) => {
    setSelectedCredential(credential);
    setProblemNote("");
    setReportDialogOpen(true);
  };

  const handleReportProblem = () => {
    if (!selectedCredential || !problemNote) return;

    setCredentials((prev) =>
      prev.map((c) =>
        c.id === selectedCredential.id
          ? { ...c, status: "Problem Reported", problemNote, updatedAt: new Date().toISOString() }
          : c
      )
    );
    toast({
      variant: "destructive",
      title: "Problem Reported",
      description: "An admin has been notified of the issue.",
    });
    setReportDialogOpen(false);
    setSelectedCredential(null);
  };
  
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Your Credentials</CardTitle>
          <p className="text-sm text-muted-foreground">
            Review your assigned credentials and take necessary actions.
          </p>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Credential</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Last Updated</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {credentials.map((cred) => {
                  const StatusIcon = statusConfig[cred.status].icon;
                  return (
                    <TableRow key={cred.id}>
                      <TableCell className="font-medium">{cred.name}</TableCell>
                      <TableCell>
                        <Badge variant={statusConfig[cred.status].badgeVariant} className="gap-1.5">
                          <StatusIcon className={`h-3.5 w-3.5 ${statusConfig[cred.status].color}`} />
                          {cred.status}
                        </Badge>
                      </TableCell>
                      <TableCell>{format(new Date(cred.updatedAt), "PPP")}</TableCell>
                      <TableCell className="text-right">
                        {cred.status === "Assigned" && (
                          <div className="flex gap-2 justify-end">
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={() => openReportDialog(cred)}
                            >
                              <FileWarning className="mr-2 h-4 w-4" />
                              Report Issue
                            </Button>
                            <Button size="sm" onClick={() => handleConfirm(cred.id)} >
                              <Check className="mr-2 h-4 w-4" />
                              Confirm
                            </Button>
                          </div>
                        )}
                        {cred.status === "Problem Reported" && (
                           <p className="text-xs text-muted-foreground italic text-right">Awaiting admin review</p>
                        )}
                         {cred.status === "Confirmed" && (
                           <p className="text-xs text-green-600 italic text-right">Confirmed</p>
                        )}
                        {cred.status === "Revoked/Inactive" && (
                           <p className="text-xs text-muted-foreground italic text-right">No action needed</p>
                        )}
                      </TableCell>
                    </TableRow>
                  );
                })}
              </TableBody>
            </Table>
          </div>
        </CardContent>
      </Card>
      
      <Dialog open={isReportDialogOpen} onOpenChange={setReportDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Report a Problem</DialogTitle>
            <DialogDescription>
              Describe the issue you're having with "{selectedCredential?.name}". An admin will review your report.
            </DialogDescription>
          </DialogHeader>
          <div className="grid gap-4 py-4">
            <div className="grid gap-2">
              <Label htmlFor="problem-note">Problem Description</Label>
              <Textarea
                id="problem-note"
                placeholder="e.g., I received a 'permission denied' error."
                value={problemNote}
                onChange={(e) => setProblemNote(e.target.value)}
              />
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setReportDialogOpen(false)}>Cancel</Button>
            <Button onClick={handleReportProblem} disabled={!problemNote}>Submit Report</Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
