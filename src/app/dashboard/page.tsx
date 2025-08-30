
"use client";

import { useEffect, useState } from 'react';
import type { User, Credential } from "@/lib/types";
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
import { Logo } from '@/components/icons';


export default function UserDashboardPage() {
  const [user, setUser] = useState<User | null>(null);
  const [credentials, setCredentials] = useState<Credential[]>([]);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    const userJson = localStorage.getItem('loggedInUser');
    if (!userJson) {
      // Redirect or handle not-logged-in state
      return;
    }
    const currentUser: User = JSON.parse(userJson);
    setUser(currentUser);

    const fetchCredentials = async () => {
      // This is not ideal for production. We should be using an API route with auth.
      // For this prototype, we'll fetch all and filter on the client.
      const res = await fetch('/api/credentials'); // This endpoint doesn't exist yet
      if (res.ok) {
        const allCredentials = await res.json();
        const userCredentials = allCredentials.filter((c: Credential) => c.userId === currentUser.id);
        setCredentials(userCredentials);
      }
      setLoading(false);
    }
    
    // For now, let's use the seeded data logic until the credentials API is ready
    const fetchSeededCredentials = async () => {
        try {
            const res = await fetch(`/api/users/${currentUser.id}/credentials`);
            if(res.ok) {
                const data = await res.json();
                setCredentials(data.credentials);
            }
        } catch (e) {
            console.error("Failed to fetch credentials", e)
        } finally {
            setLoading(false);
        }
    }


    fetchSeededCredentials();

  }, []);


  if (loading) {
    return (
      <div className="flex h-full w-full items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <Logo className="h-12 w-12 animate-pulse" />
          <p className="text-muted-foreground">Loading dashboard...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <div>User not found. Please log in.</div>;
  }

  const stats = {
    assigned: credentials.filter((c) => c.status === "Assigned").length,
    confirmed: credentials.filter((c) => c.status === "Confirmed").length,
    problem: credentials.filter((c) => c.status === "Problem Reported").length,
    revoked: credentials.filter((c) => c.status === "Revoked/Inactive").length,
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

      <UserCredentialsClient initialCredentials={credentials} />
      
    </div>
  );
}
