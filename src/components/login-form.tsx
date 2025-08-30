"use client";

import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { useToast } from "@/hooks/use-toast";
import useMockAuth from "@/hooks/use-mock-auth";
import type { User } from "@/lib/types";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";

export function LoginForm() {
  const [email, setEmail] = useState("");
  const { login } = useMockAuth();
  const { toast } = useToast();
  const [users, setUsers] = useState<User[]>([]);

  useEffect(() => {
    async function fetchUsers() {
      const res = await fetch('/api/users?all=true');
      const data = await res.json();
      setUsers(data.users);
    }
    fetchUsers();
  }, []);

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const user = login(email);
    if (!user) {
      toast({
        variant: "destructive",
        title: "Login Failed",
        description: "No user found with that email.",
      });
    }
  };

  return (
    <form className="space-y-6" onSubmit={handleSubmit}>
      <div>
        <Label htmlFor="email" className="block text-sm font-medium leading-6 text-foreground">
          Email address
        </Label>
        <div className="mt-2">
           <Select onValueChange={setEmail} value={email}>
            <SelectTrigger id="email" className="w-full">
              <SelectValue placeholder="Select a user to sign in as" />
            </SelectTrigger>
            <SelectContent>
              {users.map((user) => (
                <SelectItem key={`${user.id}-${user.email}`} value={user.email}>
                  {user.email} ({user.role})
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <div>
        <Button type="submit" className="flex w-full justify-center">
          Sign in
        </Button>
      </div>
    </form>
  );
}
