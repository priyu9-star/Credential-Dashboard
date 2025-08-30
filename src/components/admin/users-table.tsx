"use client";

import * as React from "react";
import Link from "next/link";
import type { User, UserStatus } from "@/lib/types";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { ChevronRight } from "lucide-react";
// This component is now client-side, but needs data from the server.
// We'll fetch it in an effect. A better approach for production would be
// to pass this data as props from a Server Component parent.
import {useEffect, useState} from 'react';

type UserWithCounts = User & {
  credentialCounts: {
    assigned: number;
    confirmed: number;
    problem: number;
    revoked: number;
  };
};

const statusColors: Record<UserStatus, string> = {
  Pending: "bg-yellow-100 text-yellow-800 border-yellow-200 dark:bg-yellow-900/20 dark:text-yellow-400 dark:border-yellow-800",
  Onboarded: "bg-green-100 text-green-800 border-green-200 dark:bg-green-900/20 dark:text-green-400 dark:border-green-800",
  "Offboarding-In-Progress": "bg-orange-100 text-orange-800 border-orange-200 dark:bg-orange-900/20 dark:text-orange-400 dark:border-orange-800",
  Offboarded: "bg-red-100 text-red-800 border-red-200 dark:bg-red-900/20 dark:text-red-400 dark:border-red-800",
};


export function UsersTable() {
  const [usersWithCounts, setUsersWithCounts] = useState<UserWithCounts[]>([]);
  
  useEffect(() => {
    async function fetchData() {
      // This is not ideal for production. We should be using an API route.
      // For this prototype, we'll fetch directly on the client.
      const res = await fetch('/api/users');
      const data = await res.json();
      setUsersWithCounts(data.usersWithCounts);
    }
    fetchData();
  }, []);


  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>User</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Assigned</TableHead>
            <TableHead>Confirmed</TableHead>
            <TableHead>Problems</TableHead>
            <TableHead>Revoked</TableHead>
            <TableHead><span className="sr-only">Actions</span></TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {usersWithCounts.map((user) => (
            <TableRow key={user.id}>
              <TableCell>
                <div className="flex items-center gap-3">
                  <Avatar>
                    <AvatarImage src={user.avatarUrl} alt={user.name} />
                    <AvatarFallback>{user.name.charAt(0)}</AvatarFallback>
                  </Avatar>
                  <div>
                    <div className="font-medium">{user.name}</div>
                    <div className="text-sm text-muted-foreground">{user.email}</div>
                  </div>
                </div>
              </TableCell>
              <TableCell>
                <Badge className={`border ${statusColors[user.status]}`}>{user.status}</Badge>
              </TableCell>
              <TableCell>{user.credentialCounts.assigned}</TableCell>
              <TableCell>{user.credentialCounts.confirmed}</TableCell>
              <TableCell>
                <span className={user.credentialCounts.problem > 0 ? "text-red-500 font-bold" : ""}>
                    {user.credentialCounts.problem}
                </span>
              </TableCell>
              <TableCell>{user.credentialCounts.revoked}</TableCell>
              <TableCell className="text-right">
                <Button asChild variant="outline" size="sm">
                  <Link href={`/admin/users/${user.id}`}>
                    Manage <ChevronRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}

